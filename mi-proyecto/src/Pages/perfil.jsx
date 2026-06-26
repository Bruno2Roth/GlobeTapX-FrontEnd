import "../Styles/perfil.css";
import { Link } from "react-router-dom";
import {
  FaEyeSlash,
  FaSignOutAlt,
  FaGlobe,
  FaTemperatureHigh,
} from "react-icons/fa";

export default function Profile() {
  return (
    <div className="profile-container">

      <h1 className="profile-title">Editar Perfil</h1>

      <p className="profile-subtitle">
        Actualiza tu información personal y preferencias de cuenta.
      </p>

      <div className="profile-image">
        <img
          src="/images/user.png"
          alt="Perfil"
        />
      </div>

      <Link to="/cambiar-foto" className="change-photo">
        Cambiar foto
      </Link>

      <form className="profile-form">

        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Ingrese su nombre completo"
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="Ingrese su correo electrónico"
        />

        <label>Contraseña</label>

        <div className="password-box">
          <input
            type="password"
            placeholder="Ingrese una nueva contraseña"
          />

          <button type="button">
            <FaEyeSlash />
          </button>
        </div>

        <button type="submit" className="save-btn">
          Guardar cambios
        </button>

      </form>

      <Link to="/login" className="logout">
        <FaSignOutAlt />
        Cerrar sesión
      </Link>

      <div className="preferences">

        <h3>TUS PREFERENCIAS</h3>

        <div className="preferences-buttons">

          <Link to="/clima" className="pref-btn">
            <FaTemperatureHigh />
            Clima
          </Link>

          <Link to="/idioma" className="pref-btn">
            <FaGlobe />
            Idioma
          </Link>

        </div>

      </div>

    </div>
  );
}