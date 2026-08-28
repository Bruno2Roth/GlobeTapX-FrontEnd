import { Link } from "react-router-dom";
import "../Styles/landing.css";

function Landing() {
  return (
    <main className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <Link to="/landing" className="landing-logo">
          <span className="landing-logo-icon">🌎</span>
          <span>Globe<span>TapX</span></span>
        </Link>

        <div className="landing-nav-links">
          <a href="#funciones">Funciones</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#sobre-nosotros">Sobre nosotros</a>
        </div>

        <div className="landing-nav-actions">
          <Link to="/" className="landing-login">
            Iniciar sesión
          </Link>

          <Link to="/registro" className="landing-register">
            Crear cuenta
          </Link>
        </div>
      </nav>


      {/* HERO */}
      <section className="landing-hero">

        <div className="landing-hero-content">

          <span className="landing-badge">
            ✈️ Tu compañero de viaje
          </span>

          <h1>
            Viajá por el mundo.
            <span> Nosotros te ayudamos.</span>
          </h1>

          <p>
            GlobeTapX reúne en un solo lugar todo lo que necesitás
            para organizar, disfrutar y vivir tus viajes al máximo.
          </p>

          <div className="landing-hero-buttons">
            <Link to="/registro" className="landing-primary-btn">
              Empezar ahora
              <span>→</span>
            </Link>

            <a href="#funciones" className="landing-secondary-btn">
              Descubrir GlobeTapX
            </a>
          </div>

          <div className="landing-trust">
            <div className="trust-avatars">
              <span>🌎</span>
              <span>✈️</span>
              <span>🧳</span>
            </div>

            <div>
              <strong>Todo tu viaje en un solo lugar</strong>
              <small>Información útil estés donde estés</small>
            </div>
          </div>

        </div>


        {/* HERO VISUAL */}
        <div className="landing-visual">

          <div className="world-circle">
            <div className="world-emoji">🌎</div>

            <div className="floating-card card-one">
              <span>🌤️</span>
              <div>
                <strong>Clima</strong>
                <small>18°C · Buenos Aires</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>💱</span>
              <div>
                <strong>Moneda</strong>
                <small>Conversor actualizado</small>
              </div>
            </div>

            <div className="floating-card card-three">
              <span>📍</span>
              <div>
                <strong>Tu próximo destino</strong>
                <small>Descubrí el mundo</small>
              </div>
            </div>
          </div>

        </div>

      </section>


      {/* FUNCIONES */}
      <section className="landing-features" id="funciones">

        <div className="landing-section-header">

          <span className="section-tag">
            TODO LO QUE NECESITÁS
          </span>

          <h2>
            Viajá más preparado,
            <span> disfrutá mucho más.</span>
          </h2>

          <p>
            GlobeTapX te acompaña antes y durante tu viaje,
            con herramientas pensadas para que tengas toda
            la información importante a mano.
          </p>

        </div>


        <div className="features-grid">

          <Feature
            icon="🌎"
            title="Explorá países"
            text="Conocé información útil sobre distintos destinos del mundo."
          />

          <Feature
            icon="🌤️"
            title="Consultá el clima"
            text="Revisá el clima de tu destino para estar preparado."
          />

          <Feature
            icon="💱"
            title="Convertí monedas"
            text="Calculá conversiones de moneda de manera rápida y sencilla."
          />

          <Feature
            icon="🛂"
            title="Reglas de viaje"
            text="Informate sobre documentación, entrada y recomendaciones."
          />

          <Feature
            icon="🚨"
            title="Emergencias"
            text="Encontrá rápidamente los números de emergencia de cada país."
          />

          <Feature
            icon="📅"
            title="Organizá tu viaje"
            text="Planificá actividades, eventos y todo lo que quieras hacer."
          />

        </div>

      </section>


      {/* COMO FUNCIONA */}
      <section className="landing-how" id="como-funciona">

        <div className="landing-how-image">
          <div className="phone-mockup">

            <div className="phone-top">
              <span>GlobeTapX</span>
              <span>•••</span>
            </div>

            <div className="phone-map">
              <span>🌎</span>
            </div>

            <div className="phone-info">
              <small>DESTINO</small>
              <h3>Buenos Aires 🇦🇷</h3>

              <div className="phone-stats">
                <div>
                  <span>🌤️</span>
                  <strong>18°C</strong>
                </div>

                <div>
                  <span>💱</span>
                  <strong>ARS</strong>
                </div>

                <div>
                  <span>🛂</span>
                  <strong>Reglas</strong>
                </div>
              </div>
            </div>

          </div>
        </div>


        <div className="landing-how-content">

          <span className="section-tag">
            SIMPLE Y RÁPIDO
          </span>

          <h2>
            Todo lo que necesitás
            <span> antes de viajar.</span>
          </h2>

          <p>
            No necesitás buscar información en diez lugares distintos.
            GlobeTapX centraliza las herramientas que necesitás para
            preparar tu viaje.
          </p>

          <div className="steps">

            <Step
              number="01"
              title="Elegí tu destino"
              text="Seleccioná el país que querés visitar."
            />

            <Step
              number="02"
              title="Descubrí la información"
              text="Consultá clima, moneda, reglas, emergencias y más."
            />

            <Step
              number="03"
              title="Prepará tu viaje"
              text="Organizá todo y disfrutá de tu experiencia."
            />

          </div>

        </div>

      </section>


      {/* SOBRE NOSOTROS */}
      <section className="landing-about" id="sobre-nosotros">

        <div className="about-content">

          <span className="section-tag">
            GLOBETAPX
          </span>

          <h2>
            El mundo es enorme.
            <span> Tu viaje no tiene por qué ser complicado.</span>
          </h2>

          <p>
            Creamos GlobeTapX para que viajar sea más simple,
            organizado y seguro. Una plataforma pensada para
            tener la información más importante de tu viaje
            siempre a mano.
          </p>

          <Link to="/registro" className="landing-primary-btn">
            Quiero empezar
            <span>→</span>
          </Link>

        </div>

        <div className="about-decoration">
          <span>✈️</span>
          <span>🗺️</span>
          <span>📍</span>
          <span>🧳</span>
        </div>

      </section>


      {/* CTA */}
      <section className="landing-cta">

        <div>

          <span>🌎 GLOBETAPX</span>

          <h2>
            Tu próxima aventura
            <br />
            empieza ahora.
          </h2>

          <p>
            Creá tu cuenta y empezá a descubrir todo lo que
            GlobeTapX tiene para ofrecerte.
          </p>

          <Link to="/registro" className="cta-button">
            Crear mi cuenta
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="footer-brand">

          <Link to="/landing" className="landing-logo">
            <span className="landing-logo-icon">🌎</span>
            <span>Globe<span>TapX</span></span>
          </Link>

          <p>
            Tu compañero para viajar por el mundo.
          </p>

        </div>

        <div className="footer-links">

          <a href="#funciones">Funciones</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#sobre-nosotros">Sobre nosotros</a>
          <Link to="/">Iniciar sesión</Link>

        </div>

        <div className="footer-copy">
          © 2026 GlobeTapX. Todos los derechos reservados.
        </div>

      </footer>

    </main>
  );
}


/* COMPONENTE FEATURE */

function Feature({ icon, title, text }) {
  return (
    <article className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <span className="feature-arrow">
        →
      </span>

    </article>
  );
}


/* COMPONENTE STEP */

function Step({ number, title, text }) {
  return (
    <div className="step">

      <span className="step-number">
        {number}
      </span>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

    </div>
  );
}


export default Landing;
