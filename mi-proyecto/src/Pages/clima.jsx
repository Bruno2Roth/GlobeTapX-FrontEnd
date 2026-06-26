import { useEffect, useState } from "react";
import "../Styles/clima.css";
import '../index.css'
import api from "../services/api";
import { TRADUCTOR_URL } from "../config";

const descClima = {
  0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado",
  3: "Nublado", 45: "Niebla", 48: "Niebla con escarcha",
  51: "Llovizna ligera", 53: "Llovizna moderada", 55: "Llovizna densa",
  61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia intensa",
  71: "Nevada ligera", 73: "Nevada moderada", 75: "Nevada intensa",
  80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos intensos",
  95: "Tormenta", 96: "Tormenta con granizo", 99: "Tormenta con granizo intenso",
};

function Clima() {
  const userId = localStorage.getItem("userId");
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchClima = async () => {
      try {
        const userRes = await api.get(`/usuario/${userId}`);
        const userData = userRes.data;

        const paisesRes = await api.get("/pais");
        const paises = paisesRes.data;
        const pais = paises.find((p) => p.ID === userData.paisActual);
        if (!pais) throw new Error("País no encontrado");

        const tradRes = await fetch(`${TRADUCTOR_URL}?q=${encodeURIComponent(pais.nombre)}&langpair=es|en`);
        const tradData = await tradRes.json();
        const nombreEN = tradData.responseData.translatedText;
        const climaRes = await api.get(`/clima/country?country=${encodeURIComponent(nombreEN)}`);
        const data = climaRes.data;

        const codigo = data.current?.weather_code ?? 0;
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const pronostico = (data.daily?.time || []).slice(0, 5).map((fecha, i) => ({
          nombre: diasSemana[new Date(fecha).getDay()],
          max: Math.round(data.daily.temperature_2m_max[i]),
          min: Math.round(data.daily.temperature_2m_min[i]),
          codigo: data.daily.weather_code?.[i] ?? 0,
        }));

        setClima({
          temperatura: Math.round(data.current.temperature_2m),
          descripcion: descClima[codigo] || "Desconocido",
          viento: Math.round(data.current.wind_speed_10m),
          windDirection: data.current.wind_direction_10m ?? 0,
          pronostico,
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el clima");
      }
    };
    fetchClima();
  }, [userId]);

  if (error) return <div className="clima-error">{error}</div>;
  if (!clima) return <div className="clima-loading">Cargando clima...</div>;

  const dirViento = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const dirIdx = Math.round(clima.windDirection / 45) % 8;

  return (
    <div className="clima-container">
      <section className="weather-main">
        <h1 className="weather-title">{clima.descripcion}</h1>
        <div className="temp">{clima.temperatura}°</div>
      </section>

      <section className="weather-cards">
        <div className="small-card">
          <h3>{clima.viento} km/h</h3>
          <p>Viento {dirViento[dirIdx]}</p>
        </div>
      </section>

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
