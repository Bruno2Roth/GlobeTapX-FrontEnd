import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./index.css";

const idiomas = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
  { value: "fr", label: "Francés" },
  { value: "pt", label: "Portugués" },
  { value: "he", label: "Hebreo" },
];

const validarEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

function InputField({ field, type, placeholder, label, value, error, touched, onChange, onBlur }) {
  return (
    <div className="rg-field">
      <label className="rg-label" htmlFor={field}>{label}</label>
      <input
        id={field}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={"rg-input" + (error && touched ? " rg-input--error" : "")}
      />
      {error && touched && <p className="rg-field-error">{error}</p>}
    </div>
  );
}

function RegisterForm() {
  const [form, setForm] = useState({
    nombre: "",
    mail: "",
    contrasena: "",
    confirmarContrasena: "",
    nombreCompleto: "",
    numeroContacto: "",
    idiomaPreferido: "",
    paisActual: "",
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [paises, setPaises] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");
  const [paisesError, setPaisesError] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/pais").then((res) => setPaises(res.data)).catch(() => setPaisesError("Error al cargar países"));
  }, []);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validarCampo(field, value);
  };

  const validarCampo = (field, value) => {
    let error = "";
    const v = value ?? form[field];
    switch (field) {
      case "nombre":
        if (!v.trim()) error = "El nombre de usuario es obligatorio";
        break;
      case "mail":
        if (!v.trim()) error = "El correo es obligatorio";
        else if (!validarEmail(v)) error = "Formato de correo inválido";
        break;
      case "contrasena":
        if (!v) error = "La contraseña es obligatoria";
        else if (v.length < 8) error = "Mínimo 8 caracteres";
        break;
      case "confirmarContrasena":
        if (!v) error = "Confirma tu contraseña";
        else if (v !== form.contrasena) error = "Las contraseñas no coinciden";
        break;
      case "nombreCompleto":
        if (!v.trim()) error = "El nombre completo es obligatorio";
        break;
      case "numeroContacto":
        if (v && !/^[\d\s\-+()]{7,20}$/.test(v)) error = "Formato de número inválido";
        break;
      case "idiomaPreferido":
        if (!v) error = "Selecciona un idioma";
        break;
      case "paisActual":
        if (!v) error = "Selecciona un país";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validarCampo(field);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoPerfil(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");

    const allFields = Object.keys(form);
    setTouched(allFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    let valid = true;
    allFields.forEach((f) => { if (!validarCampo(f)) valid = false; });
    if (!valid) return;

    setLoading(true);
    try {
      const body = { ...form, IsAdmin: false };
      if (fotoPerfil) body.fotoPerfil = fotoPreview;
      const res = await api.post("/auth/register", body);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user?.usuarioID ?? res.data.user?.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccessMsg("¡Cuenta creada con éxito! Redirigiendo...");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setApiError(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg">
      <form className="rg-form" onSubmit={handleSubmit} noValidate>
        <h1 className="rg-title">Crear Cuenta</h1>
        <p className="rg-subtitle">Completá tus datos para registrarte</p>

        {apiError && <p className="rg-msg rg-msg--error">{apiError}</p>}
        {successMsg && <p className="rg-msg rg-msg--success">{successMsg}</p>}

        <InputField field="nombre" type="text" placeholder="usuario123" label="Nombre de usuario" value={form.nombre} error={errors.nombre} touched={touched.nombre} onChange={(e) => set("nombre", e.target.value)} onBlur={() => handleBlur("nombre")} />
        <InputField field="mail" type="email" placeholder="ejemplo@correo.com" label="Correo electrónico" value={form.mail} error={errors.mail} touched={touched.mail} onChange={(e) => set("mail", e.target.value)} onBlur={() => handleBlur("mail")} />
        <InputField field="nombreCompleto" type="text" placeholder="Juan Pérez" label="Nombre completo" value={form.nombreCompleto} error={errors.nombreCompleto} touched={touched.nombreCompleto} onChange={(e) => set("nombreCompleto", e.target.value)} onBlur={() => handleBlur("nombreCompleto")} />

        <InputField field="numeroContacto" type="tel" placeholder="+54 11 1234-5678" label="Número de contacto" value={form.numeroContacto} error={errors.numeroContacto} touched={touched.numeroContacto} onChange={(e) => set("numeroContacto", e.target.value)} onBlur={() => handleBlur("numeroContacto")} />

        <InputField field="contrasena" type="password" placeholder="••••••••" label="Contraseña" value={form.contrasena} error={errors.contrasena} touched={touched.contrasena} onChange={(e) => set("contrasena", e.target.value)} onBlur={() => handleBlur("contrasena")} />
        <InputField field="confirmarContrasena" type="password" placeholder="••••••••" label="Confirmar contraseña" value={form.confirmarContrasena} error={errors.confirmarContrasena} touched={touched.confirmarContrasena} onChange={(e) => set("confirmarContrasena", e.target.value)} onBlur={() => handleBlur("confirmarContrasena")} />

        <div className="rg-field">
          <label className="rg-label" htmlFor="idiomaPreferido">Idioma preferido</label>
          <select
            id="idiomaPreferido"
            value={form.idiomaPreferido}
            onChange={(e) => set("idiomaPreferido", e.target.value)}
            onBlur={() => handleBlur("idiomaPreferido")}
            className={"rg-input" + (errors.idiomaPreferido && touched.idiomaPreferido ? " rg-input--error" : "")}
          >
            <option value="">Seleccionar idioma</option>
            {idiomas.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
          {errors.idiomaPreferido && touched.idiomaPreferido && <p className="rg-field-error">{errors.idiomaPreferido}</p>}
        </div>

        <div className="rg-field">
          <label className="rg-label" htmlFor="paisActual">País actual</label>
          <select
            id="paisActual"
            value={form.paisActual}
            onChange={(e) => set("paisActual", e.target.value)}
            onBlur={() => handleBlur("paisActual")}
            className={"rg-input" + (errors.paisActual && touched.paisActual ? " rg-input--error" : "")}
          >
            <option value="">Seleccionar país</option>
            {paises.map((p) => <option key={p.ID} value={p.ID}>{p.nombre}</option>)}
          </select>
          {errors.paisActual && touched.paisActual && <p className="rg-field-error">{errors.paisActual}</p>}
          {paisesError && <p className="rg-field-error">{paisesError}</p>}
        </div>

        <div className="rg-field">
          <label className="rg-label">Foto de perfil</label>
          <div className="rg-foto" onClick={() => fileRef.current.click()}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" className="rg-foto-img" />
            ) : (
              <div className="rg-foto-placeholder">+</div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} hidden />
        </div>

        <button type="submit" className="rg-btn" disabled={loading}>
          {loading ? <span className="rg-spinner" /> : "Crear Cuenta"}
        </button>
      </form>

      <p className="rg-login-link">
        ¿Ya tenés cuenta? <Link to="/">Iniciar sesión</Link>
      </p>
    </div>
  );
}

export default RegisterForm;
