import { useEffect, useState } from "react";
import "./index.css";
import api from "../../services/api";

function Navbar() {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    api.get(`/usuario/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, [userId]);

  const nombre = user?.nombreCompleto || "Usuario";

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
