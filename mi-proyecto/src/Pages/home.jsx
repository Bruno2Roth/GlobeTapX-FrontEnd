import React, { useState, useEffect } from "react";

function Home() {

  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        setPais(data.country_name);
        setCiudad(data.city);

        // hora local
        const now = new Date();
        const horaLocal = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div className="card red"><p>Emergencias y Seguridad</p></div>
        <div className="card orange"><p>Vida diaria</p></div>
        <div className="card green"><p>Cambio</p></div>
        <div className="card blue"><p>Documentación</p></div>
      </div>

      {/* NAVBAR */}
      <div className="navbar">
        <p>Home</p>
        <p>Explorar</p>
        <p>Favoritos</p>
        <p>Perfil</p>
      </div>

    </div>
  );
}

export default Home;