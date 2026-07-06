import '../index.css'
import '../Styles/configuracion.css'

function Item({ icon, texto, valor }) {
  return (
    <div className="config-item">
      <span>{icon}</span>
      <span>{texto}</span>
      {valor && <span className="config-valor">{valor}</span>}
    </div>
  );
}

function Switch({ texto }) {
  return (
    <div className="config-switch">
      <span>{texto}</span>
      <label className="switch">
        <input type="checkbox" />
        <span className="slider"></span>
      </label>
    </div>
  );
}

function Configuracion() {
  const fotoRaw = localStorage.getItem("fotoPerfil");
  const foto = fotoRaw && fotoRaw !== "null" && fotoRaw !== "undefined" ? fotoRaw : "";
  const nombre = localStorage.getItem("user");
  const usuario = nombre ? (() => { try { return JSON.parse(nombre); } catch { return {}; } })() : {};
  usuario.nombreCompleto = usuario.nombreCompleto || usuario.NombreCompleto || usuario.nombre || "Usuario";
  usuario.mail = usuario.mail || usuario.Mail || usuario.correo || "correo@ejemplo.com";

  return (
    <div className="config">
      <div className="perfil-card">
        <img src={foto} alt="perfil" />
        <h2>{usuario.nombreCompleto}</h2>
        <p>{usuario.mail}</p>
        <button>Editar perfil</button>
      </div>

      <div className="grupo">
        <h4>Cuenta</h4>
        <Item icon="👤" texto="Información personal" />
        <Item icon="📋" texto="Datos personales" />
      </div>

      <div className="grupo">
        <h4>Preferencias</h4>
        <Item icon="🌐" texto="Idioma" valor="Español" />
        <Item icon="💵" texto="Moneda" valor="USD" />
        <Item icon="🔔" texto="Notificaciones" />
        <Switch texto="Tema oscuro" />
      </div>

      <div className="grupo">
        <h4>Privacidad y seguridad</h4>
        <Item icon="🔒" texto="Cambiar contraseña" />
        <Switch texto="Autenticación biométrica" />
        <Item icon="🛡" texto="Privacidad" />
      </div>

      <div className="grupo">
        <h4>Soporte</h4>
        <Item icon="❓" texto="Centro de ayuda" />
        <Item icon="📄" texto="Términos y condiciones" />
        <Item icon="ℹ" texto="Acerca de GlobeTapX" />
      </div>

      <button className="logout">Cerrar sesión</button>
    </div>
  );
}

export default Configuracion;
