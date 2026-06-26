import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEyeSlash,
  FaEye,
  FaSignOutAlt,
  FaGlobe,
  FaTemperatureHigh,
} from "react-icons/fa";
import api from "../services/api";
import "../Styles/perfil.css";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const languages = [
    { code: "es", name: "🇪🇸 Español" },
    { code: "en", name: "🇺🇸 English" },
    { code: "fr", name: "🇫🇷 Français" },
    { code: "it", name: "🇮🇹 Italiano" },
    { code: "pt", name: "🇵🇹 Português" },
    { code: "de", name: "🇩🇪 Deutsch" },
    { code: "ja", name: "🇯🇵 日本語" },
    { code: "ko", name: "🇰🇷 한국어" },
    { code: "zh-CN", name: "🇨🇳 中文" },
    { code: "ru", name: "🇷🇺 Русский" },
    { code: "ar", name: "🇸🇦 العربية" },
    { code: "hi", name: "🇮🇳 हिन्दी" },
    { code: "tr", name: "🇹🇷 Türkçe" },
    { code: "nl", name: "🇳🇱 Nederlands" },
    { code: "sv", name: "🇸🇪 Svenska" },
    { code: "pl", name: "🇵🇱 Polski" },
    { code: "el", name: "🇬🇷 Ελληνικά" },
  ];

  const [form, setForm] = useState({
    nombreCompleto: "",
    mail: "",
    contrasena: "",
    paisActual: "",
    idioma: "",
  });
  const [paises, setPaises] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      api.get(`/usuario/${userId}`),
      api.get("/pais"),
      api.get(`/usuario/idioma?usuarioId=${userId}`),
    ])
      .then(([userRes, paisRes, idiomaRes]) => {
        const u = userRes.data;
        setForm({
          nombreCompleto: u.nombreCompleto || u.NombreCompleto || "",
          mail: u.mail || u.Mail || u.correo || u.Correo || "",
          contrasena: "",
          paisActual: u.paisActual || u.PaisActual || u.paisID || u.PaisID || "",
          idioma: idiomaRes.data?.codigoIdioma || idiomaRes.data?.idioma || idiomaRes.data || "es",
        });
        setPaises(paisRes.data);
      })
      .catch(() => setMessage("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [userId]);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const body = { nombreCompleto: form.nombreCompleto, paisActual: form.paisActual };
      if (form.contrasena) body.contrasena = form.contrasena;
      await api.put(`/usuario/${userId}`, body);
      await api.put("/usuario/idioma", { usuarioId: Number(userId), codigoIdioma: form.idioma });
      setMessage("Cambios guardados");
    } catch {
      setMessage("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) return <div className="profile-container"><p>Cargando...</p></div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Editar Perfil</h1>

      <p className="profile-subtitle">
        Actualiza tu información personal y preferencias de cuenta.
      </p>

      <div className="profile-image">
        <img src="/images/user.png" alt="Perfil" />
      </div>

      <Link to="/cambiar-foto" className="change-photo">
        Cambiar foto
      </Link>

      {message && (
        <p style={{ textAlign: "center", marginBottom: 12, color: message.includes("Error") ? "#d84d4d" : "#0f766e" }}>
          {message}
        </p>
      )}

      <form className="profile-form" onSubmit={handleSave}>
        <label>Nombre completo</label>
        <input
          type="text"
          placeholder="Ingrese su nombre completo"
          value={form.nombreCompleto}
          onChange={(e) => set("nombreCompleto", e.target.value)}
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="Ingrese su correo electrónico"
          value={form.mail}
          readOnly
          className="profile-input-readonly"
        />

        <label>País actual</label>
        <select
          value={form.paisActual}
          onChange={(e) => set("paisActual", e.target.value)}
          className="profile-form-select"
        >
          <option value="">Seleccionar país</option>
          {paises.map((p) => (
            <option key={p.ID} value={p.ID}>{p.nombre}</option>
          ))}
        </select>

        <label>Idioma preferido</label>
        <select
          value={form.idioma}
          onChange={(e) => set("idioma", e.target.value)}
          className="profile-form-select"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        <label>Contraseña</label>
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ingrese una nueva contraseña"
            value={form.contrasena}
            onChange={(e) => set("contrasena", e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <button onClick={handleLogout} className="logout">
        <FaSignOutAlt />
        Cerrar sesión
      </button>

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
