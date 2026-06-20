import { useEffect, useState } from "react";
import "./index.css";
import { API, usuarioID } from "../../config";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API}/usuario/${usuarioID}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  const nombre = user?.nombreCompleto || "Usuario";
  const iniciales = nombre.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="menu-btn">☰</button>
        <div className="logo">
          <img src="/logoPestaña.png" alt="Logo" />
          <h2>GlobeTapX</h2>
        </div>
      </div>

      <div className="nav-right">
        <button className="icon-btn">🔔</button>
        <img
          className="profile"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=0E7C66&color=fff&size=40`}
          alt={nombre}
        />
      </div>
    </header>
  );
}

export default Navbar;
