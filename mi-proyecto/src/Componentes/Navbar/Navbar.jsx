import "./index.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import api from "../../services/api";


function Header() {
  const [usuario, setUsuario] = useState(null);


  useEffect(() => {
    const userId = localStorage.getItem("userId");


    if (!userId) return;


    const obtenerUsuario = async () => {
      try {
        const res = await api.get(`/usuario/${userId}`);
        setUsuario(res.data);
      } catch (error) {
        console.error(error);
      }
    };


    obtenerUsuario();
  }, []);


  return (
    <header className="page-header">
      <div className="page-header-left">
        <h1 className="page-header-title">
          Hola, {usuario?.nombre || usuario?.Nombre || "Usuario"} 👋
        </h1>


        <p className="page-header-subtitle">
          Descubrí tu próximo destino
        </p>
      </div>


      <div className="page-header-right">
        <button className="page-header-btn">
          <FiBell />
        </button>


        <Link to="/perfil" className="page-header-avatar">
          {(usuario?.nombre || usuario?.Nombre || "U")
            .charAt(0)
            .toUpperCase()}
        </Link>
      </div>
    </header>
  );
}


export default Header;
