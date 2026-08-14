import { useState, useEffect } from "react";
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
import { getAuthSession, getStoredUser, subscribeAuthSession } from "../../services/authSession";
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

function normalizeUser(user) {
  if (!user) return null;
  const name = user.nombreCompleto || user.NombreCompleto || user.nombre || user.Nombre || "";
  return { ...user, nombre: name.split(" ")[0] || "Usuario" };
}

function getCachedUser() {
  const cached = localStorage.getItem("user");
  if (!cached) return null;
  try {
    return normalizeUser(JSON.parse(cached));
  } catch {
    return null;
  }
}

function TopBar() {
  const { pathname } = useLocation();
  const [session, setSession] = useState(() => {
    const current = getAuthSession();
    return { user: current.user || getCachedUser() || getStoredUser(), photo: current.photo || "" };
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return subscribeAuthSession((nextSession) => {
      setSession({
        user: normalizeUser(nextSession.user),
        photo: nextSession.photo || "",
      });
    });
  }, []);

  const usuario = normalizeUser(session.user);
  const fotoPerfil = session.photo;

  return (
    <>
      <header className="top-bar">
        <button
          className="top-bar-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <h1 className="top-bar-title">
          <span data-translate="Hola">Hola</span>, {usuario?.nombre || usuario?.Nombre || "Usuario"}
        </h1>

        <Link to="/perfil" className="top-bar-avatar">
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          ) : (
            (usuario?.nombre || usuario?.Nombre || "U").charAt(0).toUpperCase()
          )}
        </Link>
      </header>

      {menuOpen && (
        <div
          className="top-bar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className={`top-bar-nav ${menuOpen ? "open" : ""}`}>
        <div className="nav-profile">
          <div className="nav-avatar">
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              (usuario?.nombre || "U").charAt(0).toUpperCase()
            )}
          </div>

          <div className="nav-info">
            <p className="nav-name">{usuario?.nombre || "Usuario"}</p>
            <p className="nav-mail">
              {usuario?.mail || usuario?.correo || ""}
            </p>
          </div>
        </div>

        <div className="nav-divider" />

        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link${pathname === l.to ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{l.icon}</span>
            <span className="nav-label" data-translate={l.label}>{l.label}</span>
            <span className="nav-arrow">
              <MdChevronRight />
            </span>
          </Link>
        ))}

        <div className="nav-divider" />

        <span
          className="nav-link nav-link--rules"
          onClick={() => setMenuOpen(false)}
        >
          <span className="nav-icon">
            <MdArticle />
          </span>

          <span className="nav-label" data-translate="Reglas">Reglas</span>

          <span className="nav-arrow">
            <MdChevronRight />
          </span>
        </span>
      </nav>
    </>
  );
}

export default TopBar;
