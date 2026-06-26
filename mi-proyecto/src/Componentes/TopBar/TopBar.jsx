import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import api from "../../services/api";
import "./index.css";

function TopBar() {
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    api.get(`/usuario/${userId}`).then((res) => setUsuario(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="top-bar">
        <button className="top-bar-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <h1 className="top-bar-title">
          Hola, {usuario?.nombre || usuario?.Nombre || "Usuario"} 👋
        </h1>
        <Link to="/perfil" className="top-bar-avatar">
          {(usuario?.nombre || usuario?.Nombre || "U").charAt(0).toUpperCase()}
        </Link>
      </header>

      {menuOpen && (
        <div className="top-bar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`top-bar-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/clima" onClick={() => setMenuOpen(false)}>Clima</Link>
        <Link to="/cambio" onClick={() => setMenuOpen(false)}>Cambio</Link>
        <Link to="/numEmergencia" onClick={() => setMenuOpen(false)}>Ayuda</Link>
        <Link to="/idioma" onClick={() => setMenuOpen(false)}>Idioma</Link>
        <Link to="/agenda" onClick={() => setMenuOpen(false)}>Agenda</Link>
        <Link to="/reglas" onClick={() => setMenuOpen(false)}>Reglas</Link>
        <Link to="/explorar" onClick={() => setMenuOpen(false)}>Explorar</Link>
        <Link to="/favoritos" onClick={() => setMenuOpen(false)}>Favoritos</Link>
        <Link to="/perfil" onClick={() => setMenuOpen(false)}>Perfil</Link>
        <Link to="/configuracion" onClick={() => setMenuOpen(false)}>Configuración</Link>
      </nav>
    </>
  );
}

export default TopBar;
