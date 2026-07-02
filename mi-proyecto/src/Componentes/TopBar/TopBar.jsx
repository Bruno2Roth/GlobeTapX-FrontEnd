import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { getUsuario } from "../../config";
import "./index.css";

const links = [
  { to: "/home", icon: "\u{1F3E0}", label: "Inicio" },
  { to: "/clima", icon: "\u{26C5}", label: "Clima" },
  { to: "/cambio", icon: "\u{1F4B1}", label: "Cambio" },
  { to: "/numEmergencia", icon: "\u{1F6E1}", label: "Ayuda" },
  { to: "/idioma", icon: "\u{1F30D}", label: "Idioma" },
  { to: "/agenda", icon: "\u{1F4C5}", label: "Agenda" },
  { to: "/explorar", icon: "\u{1F50D}", label: "Explorar" },
  { to: "/favoritos", icon: "\u{2B50}", label: "Favoritos" },
  { to: "/perfil", icon: "\u{1F464}", label: "Perfil" },
  { to: "/configuracion", icon: "\u{2699}\u{FE0F}", label: "Configuraci\u00F3n" },
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
        const nc = u.nombreCompleto || u.NombreCompleto || u.nombre || u.Nombre || "";
        u.nombre = nc.split(" ")[0] || "Usuario";
        setUsuario(u);
        return;
      } catch {}
    }
    getUsuario(userId).then(u => {
      const nc = u.nombreCompleto || u.NombreCompleto || u.nombre || u.Nombre || "";
      u.nombre = nc.split(" ")[0] || "Usuario";
      setUsuario(u);
      localStorage.setItem("user", JSON.stringify(u));
    }).catch(() => {});
  }, []);

  return (
    <>
      <header className="top-bar">
        <button className="top-bar-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <h1 className="top-bar-title">
          Hola, {usuario?.nombre || usuario?.Nombre || "Usuario"}
        </h1>
        <Link to="/perfil" className="top-bar-avatar">
          {(usuario?.nombre || usuario?.Nombre || "U").charAt(0).toUpperCase()}
        </Link>
      </header>

      {menuOpen && (
        <div className="top-bar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`top-bar-nav ${menuOpen ? "open" : ""}`}>
        <div className="nav-profile">
          <div className="nav-avatar">
            {(usuario?.nombre || "U").charAt(0).toUpperCase()}
          </div>
          <div className="nav-info">
            <p className="nav-name">{usuario?.nombre || "Usuario"}</p>
            <p className="nav-mail">{usuario?.mail || usuario?.correo || ""}</p>
          </div>
        </div>

        <div className="nav-divider" />

        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link${pathname === l.to ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{l.icon}</span>
            <span className="nav-label">{l.label}</span>
            <span className="nav-arrow">{">"}</span>
          </Link>
        ))}

        <div className="nav-divider" />
        <span className="nav-link nav-link--rules" onClick={() => setMenuOpen(false)}>
          <span className="nav-icon">{'\u{1F4CB}'}</span>
          <span className="nav-label">Reglas</span>
          <span className="nav-arrow">{">"}</span>
        </span>
      </nav>
    </>
  );
}

export default TopBar;
