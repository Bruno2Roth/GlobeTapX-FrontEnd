import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {

  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");
  const HOST = "LOCALHOST"
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        setPais("http://" + HOST + ":3000/api/pais/1");
        setCiudad(data.city);

        const now = new Date();
        const horaLocal = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
        setHora(horaLocal);
      });
  }, []);

  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <h2>Tu viaje global comienza aquí</h2>

          <input
            type="text"
            placeholder="¿A dónde vamos ahora?"
            className="search"
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className="location">
        <p className="label">CURRENTLY EXPLORING</p>
        <h3>{pais || "Cargando..."}</h3>
        <p className="time">
          {ciudad || "..."} · {hora || "..."} LOCAL
        </p>
      </div>

      {/* CARDS */}
      <div className="cards">

        <Link to="/seguridad" className="card red">
          <p>Emergencias y Seguridad</p>
        </Link>

        <Link to="/vida" className="card orange">
          <p>Vida diaria</p>
        </Link>

        <Link to="/cambio" className="card green">
          <p>Cambio</p>
        </Link>

        <Link to="/documentacion" className="card blue">
          <p>Documentación</p>
        </Link>

      </div>

      {/* BOTONES CHICOS */}
      <div className="mini-buttons">

        <Link to="/clima" className="mini-btn">
          <p>Clima</p>
        </Link>

        <Link to="/idioma" className="mini-btn">
          <p>Idioma</p>
        </Link>

        <Link to="/reglas" className="mini-btn">
          <p>Reglas</p>
        </Link>

        <Link to="/alojamiento" className="mini-btn">
          <p>Alojamiento</p>
        </Link>

      </div>

      {/* NAVBAR */}
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/explorar">Explorar</Link>
        <Link to="/favoritos">Favoritos</Link>
        <Link to="/perfil">Perfil</Link>
      </div>

    </div>
  );
}

export default Home;