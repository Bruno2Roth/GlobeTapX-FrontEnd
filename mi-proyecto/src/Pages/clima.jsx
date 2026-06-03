import { useEffect, useState } from "react";
import "../index.css";

function Clima() {
  const [clima, setClima] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/clima")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el clima");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setClima(data);
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

      <div className="clima-header">
        <span>☰</span>

        <h3 className="logo">GlobeTapX</h3>

        <div className="perfil">
          {clima.usuario?.charAt(0) || "U"}
        </div>
      </div>

      <div className="weather-main">

        <p className="location">
          {clima.ciudad}, {clima.pais}
        </p>

        <h1 className="weather-title">
          {clima.descripcion}
        </h1>

        <div className="temperature">
          {clima.temperatura}°
        </div>

      </div>

      <div className="weather-info">

        <div className="info-card">
          <h4>{clima.humedad}%</h4>
          <p>Humedad</p>
        </div>

        <div className="info-card">
          <h4>{clima.viento} km/h</h4>
          <p>Viento</p>
        </div>

      </div>

      <div className="image-card">
        <div className="overlay">
          <h3>Día Perfecto para Explorar</h3>
          <p>
            {clima.mensaje || "Condiciones ideales para salir."}
          </p>
        </div>
      </div>

      <div className="uv-card">
        <p>Índice UV</p>

        <h2>
          {clima.indiceUVTexto || "No disponible"}
        </h2>

        <span>
          {clima.recomendacionUV || ""}
        </span>
      </div>

      <div className="forecast">

        <h2>Previsión de 5 días</h2>

        {clima.pronostico?.map((dia, index) => (
          <div className="forecast-day" key={index}>
            <span>{dia.nombre}</span>
            <span>{dia.max}°</span>
            <span>{dia.min}°</span>
          </div>
        ))}

      </div>

      <div className="footer">
        <p>EXPLORE</p>
        <p>FAVORITES</p>
        <p>CULTURE</p>
        <p>FACTS</p>
        <p>PROFILE</p>
      </div>

    </div>
  );
}

export default Clima;