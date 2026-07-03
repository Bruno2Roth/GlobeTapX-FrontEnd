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
  MdTravelExplore,
  MdFavorite,
  MdPerson,
  MdSettings,
  MdArticle,
  MdChevronRight,
} from "react-icons/md";
import { getUsuario } from "../../config";
import "./index.css";

const links = [
  { to: "/home", icon: <MdHome />, label: "Inicio" },
  { to: "/clima", icon: <MdSunny />, label: "Clima" },
  { to: "/cambio", icon: <MdCurrencyExchange />, label: "Cambio" },
  { to: "/numEmergencia", icon: <MdEmergency />, label: "Ayuda" },
  { to: "/idioma", icon: <MdTranslate />, label: "Idioma" },
  { to: "/agenda", icon: <MdEvent />, label: "Agenda" },
  { to: "/explorar", icon: <MdTravelExplore />, label: "Explorar" },
  { to: "/favoritos", icon: <MdFavorite />, label: "Favoritos" },
  { to: "/perfil", icon: <MdPerson />, label: "Perfil" },
  { to: "/configuracion", icon: <MdSettings />, label: "Configuración" },
];

function TopBar() {
  const { pathname } = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const cached = localStorage.getItem("user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        const nc =
          u.nombreCompleto ||
          u.NombreCompleto ||
          u.nombre ||
          u.Nombre ||
          "";
        u.nombre = nc.split(" ")[0] || "Usuario";
        setUsuario(u);
        return;
      } catch {}
    }

    getUsuario(userId)
      .then((u) => {
        const nc =
          u.nombreCompleto ||
          u.NombreCompleto ||
          u.nombre ||
          u.Nombre ||
          "";
        u.nombre = nc.split(" ")[0] || "Usuario";
        setUsuario(u);
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {});
  }, []);

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
          Hola, {usuario?.nombre || usuario?.Nombre || "Usuario"}
        </h1>

        <Link to="/perfil" className="top-bar-avatar">
          {(usuario?.nombre || usuario?.Nombre || "U")
            .charAt(0)
            .toUpperCase()}
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
            {(usuario?.nombre || "U").charAt(0).toUpperCase()}
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
            <span className="nav-label">{l.label}</span>
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

          <span className="nav-label">Reglas</span>

          <span className="nav-arrow">
            <MdChevronRight />
          </span>
        </span>
      </nav>
    </>
  );
}

export default TopBar;