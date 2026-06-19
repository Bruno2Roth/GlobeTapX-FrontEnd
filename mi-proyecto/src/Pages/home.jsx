import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { API, usuarioID } from "../config";

function Home() {
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");
  const [heroImg, setHeroImg] = useState("");

  useEffect(() => {
        fetch(`${API}/usuario/${usuarioID}`)
      .then((res) => res.json())
      .then((usuario) => {
        fetch(`${API}/pais`)
          .then((res) => res.json())
          .then((paises) => {
            const p = paises.find((p) => p.ID === usuario.paisActual);
            if (p) {
              setPais(p.nombre);
              setHeroImg(p.imagen || "");
              setCiudad(p.nombre);
            }
          });
      })
      .catch((error) => console.log(error));

    const now = new Date();
    setHora(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, []);

  return (
    <div className="home">
      <div
        className="hero"
        style={
          heroImg
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${heroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <div className="hero-content">
          <h2>Tu viaje global comienza aquí</h2>
          <input
            type="text"
            placeholder="¿A dónde vamos ahora?"
            className="search"
          />
        </div>
      </div>

      <div className="location">
        <p className="label">CURRENTLY EXPLORING</p>
        <h3>{pais || "Cargando..."}</h3>
        <p className="time">
          {ciudad || "..."} · {hora || "..."} LOCAL
        </p>
      </div>

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
