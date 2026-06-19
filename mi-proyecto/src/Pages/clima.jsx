import { useEffect, useState } from "react";
import "../index.css";
import { API } from "../config";


function Clima() {
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `http://${HOST}:${PORT}/api`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el clima");
        }
        return res.json();
      })
      .then((data) => {
        const diasSemana = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];

        const pronostico = data.daily.time
          .slice(1, 6)
          .map((fecha, index) => ({
            nombre: diasSemana[new Date(fecha).getDay()],
            max: Math.round(data.daily.temperature_2m_max[index + 1]),
            min: Math.round(data.daily.temperature_2m_min[index + 1]),
          }));

        setClima({
          ciudad: "Buenos Aires",
          pais: "Argentina",
          descripcion: "Mayormente Soleado",
          temperatura: Math.round(data.current.temperature_2m),
          humedad: data.current.relative_humidity_2m,
          viento: Math.round(data.current.wind_speed_10m),

          mensaje:
            "Condiciones ideales para recorrer la ciudad y disfrutar al aire libre.",

          indiceUVTexto: "Moderado",
          recomendacionUV:
            "Usá protector solar si vas a permanecer mucho tiempo al sol.",

          pronostico,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el clima");
      });
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!clima) {
    return <h2>Cargando clima...</h2>;
  }

  return (
    <div className="clima-container">
      <header className="clima-header">
        <div className="menu">☰</div>

        <h2 className="logo">GlobeTapX</h2>

        <div className="avatar">S</div>
      </header>

      <section className="weather-main">
        <p className="location">
          {clima.ciudad}, {clima.pais}
        </p>

        <h1 className="weather-title">
          {clima.descripcion}
        </h1>

        <div className="temp">
          {clima.temperatura}°
        </div>
      </section>

      <section className="weather-cards">
        <div className="small-card">
          <h3>{clima.humedad}%</h3>
          <p>Humedad</p>
        </div>

        <div className="small-card">
          <h3>{clima.viento} km/h</h3>
          <p>Viento</p>
        </div>
      </section>

      <section className="hero-card">
        <div className="hero-overlay">
          <h3>Día Perfecto para Explorar</h3>

          <p>{clima.mensaje}</p>
        </div>
      </section>

      <section className="uv-card">
        <p>Índice UV</p>

        <h2>{clima.indiceUVTexto}</h2>

        <span>{clima.recomendacionUV}</span>
      </section>

      <section className="forecast">
        <h2>Previsión de 5 días</h2>

        {clima.pronostico.map((dia, index) => (
          <div className="forecast-row" key={index}>
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