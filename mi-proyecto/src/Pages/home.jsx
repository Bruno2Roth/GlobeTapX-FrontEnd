<<<<<<< HEAD
import React from 'react';

const Home = () => {
  return (
    <div className="home-screen">
      {/* Header Superior */}
      <header className="home-header">
        <div className="icon-menu">☰</div>
        <h2 className="brand-logo">GlobeTapX</h2>
        <div className="user-avatar">
          <img src="https://i.pravatar.cc/100?img=32" alt="profile" />
        </div>
      </header>

      {/* Hero Section con Buscador */}
      <section className="hero-card">
        <div className="hero-overlay">
          <h1>Tu viaje global comienza aquí</h1>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="¿A dónde vamos ahora?" />
          </div>
        </div>
      </section>

      {/* Sección de Exploración Actual */}
      <section className="exploration-info">
        <p className="label-blue">CURRENTLY EXPLORING</p>
        <div className="country-row">
          <h2 className="country-name">Bolivia</h2>
          <div className="compass-badge">🧭</div>
        </div>
        
        <div className="map-preview">
          <div className="local-time-tag">
            <span className="dot">●</span> LA PAZ • 14:20 LOCAL
          </div>
        </div>
      </section>

      {/* Rejilla de Servicios de Colores */}
      <div className="services-grid">
        <div className="s-card red">
          <div className="s-icon">✱</div>
          <h4>Emergencias y seguridad</h4>
          <p>Local 110 / 911</p>
        </div>
        <div className="s-card orange">
          <div className="s-icon">🎫</div>
          <h4>Vida diaria</h4>
          <p>Local Customs</p>
        </div>
        <div className="s-card cyan">
          <div className="s-icon">💵</div>
          <h4>Cambio</h4>
          <p>BOB 1 = USD 0.14</p>
        </div>
        <div className="s-card gray">
          <div className="s-icon">🕒</div>
          <h4>Documentación</h4>
          <p>Visa Required</p>
        </div>
      </div>

      {/* Botones Tipo Píldora */}
      <div className="pills-row">
        <div className="pill-item">☁️ Clima</div>
        <div className="pill-item">🌐 Idioma</div>
        <div className="pill-item">📏 Reglas</div>
        <div className="pill-item">🏠 Alojamiento</div>
      </div>

      {/* Navegación Inferior */}
      <nav className="bottom-bar">
        <div className="nav-btn active">🧭<span>EXPLORE</span></div>
        <div className="nav-btn">❤️<span>FAVORITES</span></div>
        <div className="nav-btn">🏠<span>HOME</span></div>
        <div className="nav-btn">💡<span>FACTS</span></div>
        <div className="nav-btn">👤<span>PROFILE</span></div>
      </nav>
    </div>
  );
};

export default Home;
=======
import Header from '../Componentes/Header/Header'
import HeroBanner from '../Componentes/HeroBanner/HeroBanner'
import SearchBar from '../Componentes/SearchBar/SearchBar'
import CardDestino from '../Componentes/CardDestino/CardDestino'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Home() {
  return (
    <div className='page'>

      <Header
        title='Tus Favoritos'
        subtitle='Explorá destinos increíbles'
      />

      <HeroBanner />

      <SearchBar />

      <CardDestino
        titulo='Positano Cliffs'
        pais='Italia'
        imagen='URL'
      />

      <CardDestino
        titulo='Auroras Boreales'
        pais='Islandia'
        imagen='URL'
      />

      <BottomNav />

    </div>
  )
}

export default Home
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
