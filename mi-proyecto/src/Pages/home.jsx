import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import '../index.css'
import api from "../services/api";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";

function Home() {
  const userId = localStorage.getItem("userId");

  const [pais, setPais] = useState("");
  const [hora, setHora] = useState("");
  const [heroImg, setHeroImg] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const { data: usuario } = await api.get(`/usuario/${userId}`);
        const paisActual = usuario.paisActual;

        const { data: paisData } = await api.get(`/pais/${paisActual}`);
        setPais(paisData.nombre);
        setHeroImg(paisData.imagen || "");
        setHora(paisData.local_time?.split("T")[1]?.slice(0, 5) || "");
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
