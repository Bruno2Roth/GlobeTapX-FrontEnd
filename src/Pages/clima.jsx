import { useEffect, useState } from "react";
import {
  CalendarDays,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Navigation,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import "../Styles/clima.css";
import "../index.css";
import { getPaises, getClima, translateText } from "../services/backendApi";
import { obtenerCache, guardarCache } from "../helpers/cache";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";
import { useSession } from "../context/SessionContext";

const descClima = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna densa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos intensos",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo intenso",
};

const CACHE_PAIS_KEY = (userId, countryId) => `clima_pais_${userId}_${countryId || "sin-pais"}`;
const CACHE_PAIS_TTL = 86400000;
const CACHE_CLIMA_KEY = (userId, countryId) => `clima_${userId}_${countryId || "sin-pais"}`;

const getWeatherIcon = (code) => {
  if (code === 0) return Sun;
  if ([1, 2].includes(code)) return CloudSun;
  if (code === 3) return Cloud;
  if ([45, 48].includes(code)) return CloudFog;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return CloudRain;
  if ([71, 73, 75].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;

  return Cloud;
};

function Clima() {
  const { user, userId } = useSession();
  const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setClima(null);
      setCacheTimestamp(null);
      setError("");
      return () => { active = false; };
    }

    const cache = obtenerCache(CACHE_CLIMA_KEY(userId, userCountryId));

    if (cache) {
      setClima(cache.data);
      setCacheTimestamp(cache.timestamp);
      setError("");
      return () => { active = false; };
    }

    setClima(null);
    setCacheTimestamp(null);
    setError("");

    const fetchClima = async () => {
      try {
        const cachePais = obtenerCache(
          CACHE_PAIS_KEY(userId, userCountryId),
          CACHE_PAIS_TTL
        );

        let nombreEN = cachePais?.data?.nombreEN;

        if (!nombreEN) {
          const paises = await getPaises();
          const pais = paises.find((p) => String(p.ID) === String(userCountryId));

          if (!pais) throw new Error("País no encontrado");

          nombreEN = pais.nombre;

          try {
            const trad = await translateText({
              text: pais.nombre,
              targetLanguage: "en",
              sourceLanguage: "es",
            });

            nombreEN = trad.data.translatedText;
          } catch (translationError) {
            console.warn("Falló la traducción del país:", translationError);
          }

          guardarCache(CACHE_PAIS_KEY(userId, userCountryId), { nombreEN });
        }

        const data = await getClima(nombreEN);
        if (!active) return;
        const codigo = data.current?.weather_code ?? 0;
        const diasSemana = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];

        const pronostico = (data.daily?.time || []).slice(0, 5).map((fecha, i) => ({
          nombre: i === 0 ? "Hoy" : diasSemana[new Date(fecha).getDay()],
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
          codigo: data.daily.weather_code?.[i] ?? 0,
        }));

        const climaData = {
          temperatura: Math.round(data.current.temperature_2m),
          descripcion: descClima[codigo] || "Desconocido",
          codigo,
          viento: Math.round(data.current.wind_speed_10m),
          windDirection: data.current.wind_direction_10m ?? 0,
          pronostico,
        };

        if (!active) return;
        guardarCache(CACHE_CLIMA_KEY(userId, userCountryId), climaData);
        setCacheTimestamp(Date.now());
        setClima(climaData);
      } catch (err) {
        if (active) {
          console.error("Error en clima:", err);
          setError(CONNECTION_ERROR_MESSAGE);
        }
      }
    };

    void fetchClima();
    return () => { active = false; };
  }, [userCountryId, userId]);

  if (error) return <div className="clima-error">{error}</div>;
  if (!clima) return <div className="clima-loading">Cargando clima...</div>;

  const dirViento = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const dirIdx = Math.round(clima.windDirection / 45) % 8;
  const WeatherIcon = getWeatherIcon(clima.codigo);

  return (
    <div className="clima-container">
      <section className="weather-main">
        <div className="weather-main-content">
          <div className="weather-status">
            <WeatherIcon size={19} />
            Condiciones actuales
          </div>

          <div className="weather-icon">
            <WeatherIcon size={58} strokeWidth={1.5} />
          </div>

          <h1 className="weather-title">{clima.descripcion}</h1>
          <div className="temp">{clima.temperatura}°</div>
          <p className="weather-caption">Temperatura actual</p>

          {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
        </div>
      </section>

      <section className="weather-cards">
        <article className="small-card wind-card">
          <div className="metric-icon">
            <Wind size={19} />
          </div>
          <div>
            <p>Viento</p>
            <h3 className="metric-value">{clima.viento} km/h</h3>
          </div>
        </article>

        <article className="small-card direction-card">
          <div className="metric-icon wind-direction-icon">
            <Navigation
              size={20}
              strokeWidth={2.2}
              style={{ transform: `rotate(${clima.windDirection}deg)` }}
            />
          </div>
          <div>
            <p>Dirección</p>
            <small className="degree-value metric-value">{clima.windDirection}{"\u00b0"}</small>
          </div>
        </article>
      </section>

      <section className="forecast">
        <div className="forecast-heading">
          <div>
            <span>Próximos días</span>
            <h2>Pronóstico</h2>
          </div>
          <CalendarDays size={19} />
        </div>

        {clima.pronostico.map((dia, i) => {
          const ForecastIcon = getWeatherIcon(dia.codigo);

          return (
            <article className="forecast-row" key={i}>
              <div className="forecast-day">
                <div className="forecast-icon">
                  <ForecastIcon size={20} strokeWidth={1.7} />
                </div>
                <span>{dia.nombre}</span>
              </div>

              <div className="forecast-temperatures">
                <span className="max-temp">
                  <Thermometer size={13} />
                  {dia.max}°
                </span>
                <span className="min-temp">{dia.min}°</span>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default Clima;
