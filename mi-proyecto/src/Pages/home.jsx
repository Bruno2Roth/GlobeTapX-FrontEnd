import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import '../index.css'
import api from "../services/api";
import { TRADUCTOR_URL } from "../config";
import { obtenerCache, guardarCache } from "../helpers/cache";

function Home() {
  const userId = localStorage.getItem("userId");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");
  const [heroImg, setHeroImg] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const userRes = await api.get(`/usuario/${userId}`);
        const usuario = userRes.data;
        const paisActual = usuario.paisActual;

        const cacheKey = `home_cache_${userId}`;
        const cache = obtenerCache(cacheKey);
        if (cache && cache.data.paisActual === paisActual) {
          setPais(cache.data.pais);
          setCiudad(cache.data.ciudad);
          setHora(cache.data.hora);
          setHeroImg(cache.data.heroImg);
          setCacheTimestamp(cache.timestamp);
          return;
        }

        const paisesRes = await api.get("/pais");
        const paises = paisesRes.data;

        const p = paises.find((p) => p.ID === paisActual);
        if (p) {
          setPais(p.nombre);
          setHeroImg(p.imagen || "");
          setCiudad(p.nombre);

          const tradRes = await fetch(`${TRADUCTOR_URL}?q=${encodeURIComponent(p.nombre)}&langpair=es|en`);
          const tradData = await tradRes.json();
          const nombreEN = tradData.responseData.translatedText;
          const climaRes = await api.get(`/clima/country?country=${encodeURIComponent(nombreEN)}`);
          const clima = climaRes.data;
          let horaLocal = ""
          if (clima.current?.time) {
            const h = clima.current.time.split("T")[1]?.slice(0, 5);
            if (h) horaLocal = h;
          }
          setHora(horaLocal);
          const homeData = { pais: p.nombre, ciudad: p.nombre, hora: horaLocal, heroImg: p.imagen || "", paisActual };
          guardarCache(cacheKey, homeData);
          setCacheTimestamp(Date.now());
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

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
        {cacheTimestamp && <p className="cache-timer">⏱ Último cache: {new Date(cacheTimestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>}
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
