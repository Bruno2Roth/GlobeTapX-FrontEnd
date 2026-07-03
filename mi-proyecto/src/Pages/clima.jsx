import { useEffect, useState } from "react";
import "../Styles/clima.css";
import '../index.css'
import { getUsuario, getPaises, getClima, traducir } from "../config";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";

// Mapeo de códigos numéricos de clima a descripciones en español
const descClima = {
  0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado",
  3: "Nublado", 45: "Niebla", 48: "Niebla con escarcha",
  51: "Llovizna ligera", 53: "Llovizna moderada", 55: "Llovizna densa",
  61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia intensa",
  71: "Nevada ligera", 73: "Nevada moderada", 75: "Nevada intensa",
  80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos intensos",
  95: "Tormenta", 96: "Tormenta con granizo", 99: "Tormenta con granizo intenso",
};

// Cache del pais traducido (24h) — evita llamar a la API de traducción en cada fetch
const CACHE_PAIS_KEY = userId => `clima_pais_${userId}`;
const CACHE_PAIS_TTL = 86400000;

// Cache del clima (1h por defecto)
const CACHE_CLIMA_KEY = userId => `clima_${userId}`;

function Clima() {
  const userId = localStorage.getItem("userId");
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // 1. Intentar cache del clima
    const cache = obtenerCache(CACHE_CLIMA_KEY(userId));
    if (cache) {
      setClima(cache.data);
      setCacheTimestamp(cache.timestamp);
      return;
    }

    const fetchClima = async () => {
      try {
        // 2. Intentar cache del nombre del pais traducido para saltar pasos
        const cachePais = obtenerCache(CACHE_PAIS_KEY(userId), CACHE_PAIS_TTL);
        let nombreEN = cachePais?.data?.nombreEN;

        if (!nombreEN) {
          // 3. Cache de pais no disponible → obtener usuario y países
          const userData = await getUsuario(userId);
          const paises = await getPaises();
          const pais = paises.find((p) => p.ID === userData.paisActual);
          if (!pais) throw new Error("País no encontrado");

          nombreEN = pais.nombre;
          try {
            const trad = await traducir({ text: pais.nombre, targetLanguage: 'en', sourceLanguage: 'es' });
            nombreEN = trad.data.translatedText;
          } catch (e) {
            console.warn("Falló traducción, usando nombre original:", nombreEN, e);
          }

          // Cachear el nombre traducido para el próximo fetch
          guardarCache(CACHE_PAIS_KEY(userId), { nombreEN });
        }

        // 4. Consultar clima con el nombre del país en inglés
        const data = await getClima(nombreEN);

        // 5. Procesar respuesta
        const codigo = data.current?.weather_code ?? 0;
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const pronostico = (data.daily?.time || []).slice(0, 5).map((fecha, i) => ({
          nombre: diasSemana[new Date(fecha).getDay()],
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
          codigo: data.daily.weather_code?.[i] ?? 0,
        }));

        const climaData = {
          temperatura: Math.round(data.current.temperature_2m),
          descripcion: descClima[codigo] || "Desconocido",
          viento: Math.round(data.current.wind_speed_10m),
          windDirection: data.current.wind_direction_10m ?? 0,
          pronostico,
        };

        // 6. Cachear resultado final
        guardarCache(CACHE_CLIMA_KEY(userId), climaData);
        setCacheTimestamp(Date.now());
        setClima(climaData);
      } catch (err) {
        console.error("Error en clima:", err);
        setError(`No se pudo cargar el clima (${err.status || err.message})`);
      }
    };
    fetchClima();
  }, [userId]);

  if (error) return <div className="clima-error">{error}</div>;
  if (!clima) return <div className="clima-loading">Cargando clima...</div>;

  // Direcciones del viento en español
  const dirViento = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const dirIdx = Math.round(clima.windDirection / 45) % 8;

  return (
    <div className="clima-container">
      {/* Bloque principal: descripción + temperatura */}
      <section className="weather-main">
        <h1 className="weather-title">{clima.descripcion}</h1>
        <div className="temp">{clima.temperatura}°</div>
        {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
      </section>

      {/* Cards informativas */}
      <section className="weather-cards">
        <div className="small-card">
          <h3>{clima.viento} km/h</h3>
          <p>Viento {dirViento[dirIdx]}</p>
        </div>
      </section>

      {/* Pronóstico 5 días */}
      <section className="forecast">
        <h2>Pronóstico 5 días</h2>
        {clima.pronostico.map((dia, i) => (
          <div className="forecast-row" key={i}>
            <span>{dia.nombre}</span>
            <span>{dia.max}°</span>
            <span>{dia.min}°</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Clima;
