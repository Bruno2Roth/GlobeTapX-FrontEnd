import './Pages.css'
import React, { useEffect, useState } from 'react';

const Home = () => {

  const [pais, setPais] = useState(null)

  useEffect(() => {

    fetch('http://localhost:3000/api/pais')

      .then((response) => response.json())

      .then((data) => {

        setPais(data)

      })

      .catch((error) => {

        console.log(error)

      })

  }, [])

  return (
    <div className="home-screen">

      {/* Header Superior */}
      <header className="home-header">
        <div className="icon-menu">☰</div>

        <h2 className="brand-logo">GlobeTapX</h2>

        <div className="user-avatar">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="profile"
          />
        </div>
      </header>

      {/* Hero */}
      <section className="hero-card">

        <div className="hero-overlay">

          <h1>
            Tu viaje comienza aquí
          </h1>

          <div className="search-container">

            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="¿A dónde vamos ahora?"
            />

          </div>

        </div>

      </section>

      {/* Info país */}
      <section className="exploration-info">

        <p className="label-blue">
          ACTUALMENTE EXPLORANDO
        </p>

        <div className="country-row">

          <h2 className="country-name">

            {pais ? pais.nombre : 'Cargando...'}

          </h2>

          <div className="compass-badge">
            🧭
          </div>

        </div>

        <div className="map-preview">

          <div className="local-time-tag">

            <span className="dot">●</span>

            {pais
              ? `${pais.ciudad} • ${pais.hora}`
              : 'Cargando hora...'}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
