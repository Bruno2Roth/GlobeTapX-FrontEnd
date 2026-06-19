import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Home() {

  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {

        setPais(data.country_name);
        setCiudad(data.city);

        const now = new Date();

        const horaLocal = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setHora(horaLocal);

      })
      .catch((error) => console.log(error));

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

        <p className="label">
          CURRENTLY EXPLORING
        </p>

        <h3>
          {pais || "Cargando..."}
        </h3>

        <p className="time">
          {ciudad || "..."} · {hora || "..."} LOCAL
        </p>

      </div>

      {/* CARDS */}
      <div className="cards">

        <Link to="/numEmergencia" className="card red">
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

        <Link to="/Agenda" className="mini-btn">
          <p>Agenda</p>
        </Link>

      </div>

  

    </div>
  );
}

export default Home;