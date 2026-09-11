import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  MdHome,
  MdSunny,
  MdCurrencyExchange,
  MdEmergency,
  MdTranslate,
  MdEvent,
  MdEventAvailable,
  MdFavorite,
  MdPerson,
  MdArticle,
  MdChevronRight,
} from "react-icons/md";
import { useSession } from "../../context/SessionContext";
import "./index.css";

const links = [
  { to: "/home", icon: <MdHome />, label: "Inicio" },
  { to: "/clima", icon: <MdSunny />, label: "Clima" },
  { to: "/cambio", icon: <MdCurrencyExchange />, label: "Cambio" },
  { to: "/numEmergencia", icon: <MdEmergency />, label: "Ayuda" },
  { to: "/idioma", icon: <MdTranslate />, label: "Idioma" },
  { to: "/agenda", icon: <MdEvent />, label: "Agenda" },
  { to: "/eventos", icon: <MdEventAvailable />, label: "Eventos" },
  { to: "/documentacion", icon: <MdArticle />, label: "Documentación" },
  { to: "/favoritos", icon: <MdFavorite />, label: "Favoritos" },
  { to: "/perfil", icon: <MdPerson />, label: "Perfil" },
];

function TopBar() {
  const { pathname } = useLocation();
  const { user, photo } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const fullName = user?.nombreCompleto || user?.NombreCompleto || user?.nombre || user?.Nombre || "";
  const displayName = fullName.split(" ")[0] || "Usuario";
  const displayMail = user?.mail || user?.correo || "";

  return (
    <>
      <header className="top-bar">
        <button
          className="top-bar-menu"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
          aria-label="Abrir menú"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <h1 className="top-bar-title">
          <span data-translate="Hola">Hola</span>, {displayName}
        </h1>

        <Link to="/perfil" className="top-bar-avatar">
          {photo ? (
            <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </Link>
      </header>

      {menuOpen && (
        <div
          className="top-bar-overlay"
          onClick={() => setMenuOpen(false)}
          role="presentation"
        />
      )}

      <nav className={`top-bar-nav ${menuOpen ? "open" : ""}`}>
        <div className="nav-profile">
          <div className="nav-avatar">
            {photo ? (
              <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="nav-info">
            <p className="nav-name">{displayName}</p>
             <p className="nav-mail">{displayMail}</p>
          </div>
        </div>

        <div className="nav-divider" />

        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link${pathname === link.to ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label" data-translate={link.label}>{link.label}</span>
            <span className="nav-arrow"><MdChevronRight /></span>
          </Link>
        ))}

        <div className="nav-divider" />

        <Link
          to="/reglas"
          className={`nav-link nav-link--rules${pathname === "/reglas" ? " active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="nav-icon"><MdArticle /></span>
          <span className="nav-label" data-translate="Reglas">Reglas</span>
          <span className="nav-arrow"><MdChevronRight /></span>
        </Link>
      </nav>
    </>
  );
}

export default TopBar;
