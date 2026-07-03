import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import '../index.css'
import { getUsuario, getPais } from "../config";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";

function calcularHoraGMT(gmt) {
  if (gmt == null) return "";
  let offset = 0;
  if (typeof gmt === "number") {
    offset = gmt;
  } else if (typeof gmt === "string") {
    const m = gmt.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (m) {
      offset = parseFloat(m[2]) + (m[3] ? parseFloat(m[3]) / 60 : 0);
      if (m[1] === "-") offset = -offset;
    } else {
      const m2 = gmt.match(/(?:UTC|GMT)([+-]\d{1,2})/);
      if (m2) offset = parseFloat(m2[1]);
    }
  }
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utc + offset * 3600000)
    .toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function Home() {
  const userId = localStorage.getItem("userId");

  const [pais, setPais] = useState("");
  const [hora, setHora] = useState("");
  const [heroImg, setHeroImg] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const cacheKey = "home_cache_" + userId;
    const cache = obtenerCache(cacheKey);
    if (cache) {
      setPais(cache.data.pais);
      setHeroImg(cache.data.heroImg);
      setNombreUsuario(cache.data.nombreUsuario);
      setHora(calcularHoraGMT(cache.data.gmt));
      setCacheTimestamp(cache.timestamp);
      return;
    }

    const fetchData = async () => {
      try {
        const usuario = await getUsuario(userId);
        const paisActual = usuario.paisActual;

        const paisData = await getPais(paisActual);
        const gmt = paisData.gmt ?? 0;

        setPais(paisData.nombre);
        setHeroImg(paisData.imagen || "");
        setNombreUsuario(usuario.nombre || usuario.username || usuario.email || "");
        setHora(calcularHoraGMT(gmt));

        guardarCache(cacheKey, {
          pais: paisData.nombre,
          heroImg: paisData.imagen || "",
          nombreUsuario: usuario.nombre || usuario.username || usuario.email || "",
          gmt,
        });
        setCacheTimestamp(Date.now());
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
          {pais || "..."} · {hora || "..."} LOCAL
        </p>
        {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
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
        <div className="mini-btn">
          <p>Reglas</p>
        </div>
        <Link to="/Agenda" className="mini-btn">
          <p>Agenda</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
