import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { usuarioURL, paisesURL, climaBaseURL, TRADUCTOR_URL } from "../config";

function Home() {
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");
  const [heroImg, setHeroImg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(usuarioURL);
        const usuario = await userRes.json();

        const paisesRes = await fetch(paisesURL);
        const paises = await paisesRes.json();

        const p = paises.find((p) => p.ID === usuario.paisActual);
        if (p) {
          setPais(p.nombre);
          setHeroImg(p.imagen || "");
          setCiudad(p.nombre);

          const tradRes = await fetch(`${TRADUCTOR_URL}?q=${encodeURIComponent(p.nombre)}&langpair=es|en`);
          const tradData = await tradRes.json();
          const nombreEN = tradData.responseData.translatedText;
          const climaRes = await fetch(`${climaBaseURL}${encodeURIComponent(nombreEN)}`);
          const clima = await climaRes.json();
          if (clima.current?.time) {
            const h = clima.current.time.split("T")[1]?.slice(0, 5);
            if (h) setHora(h);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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
