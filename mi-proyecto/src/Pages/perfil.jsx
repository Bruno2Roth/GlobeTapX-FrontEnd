import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaSignOutAlt,
  FaTemperatureHigh,
} from "react-icons/fa";
import { getFotoPerfil, getPaises, getUsuario, updateUsuario } from "../config";
import { getPreferredLanguage, updatePreferredLanguage } from "../services/languageService";
import { normalizeLanguageCode, setPreferredLanguage, translatePage } from "../helpers/translatePage";
import { obtenerCache, guardarCache } from "../helpers/cache";
import "../Styles/perfil.css";

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "tr", name: "Türkçe" },
];

function prepareProfileImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("La imagen no es válida"));
      image.onload = () => {
        const maxSize = 1000;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function preferredCode(response) {
  return response?.codigoIdioma || response?.idioma || response?.code || response || "es";
}

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const fileRef = useRef();
  const [form, setForm] = useState({ nombreCompleto: "", mail: "", contrasena: "", paisActual: "", idioma: "es" });
  const [paises, setPaises] = useState([]);
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fotoPreview, setFotoPreview] = useState(() => localStorage.getItem("fotoPerfil") || "");

  const applyPreferredLanguage = (response) => {
    const language = normalizeLanguageCode(preferredCode(response));
    setForm((previous) => ({ ...previous, idioma: language }));
    setPreferredLanguage(language);
    void translatePage(language).catch((error) => console.warn("No se pudo traducir el perfil:", error));
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const cacheKey = `perfil_cache_${userId}`;
    const cache = obtenerCache(cacheKey);
    if (cache) {
      setForm(cache.data.form);
      setPaises(cache.data.paises || []);
      setFotoPreview(cache.data.fotoPreview || "");
      setLoading(false);
      getPreferredLanguage(userId).then(applyPreferredLanguage).catch(() => {});
      return;
    }

    (async () => {
      try {
        const [user, countryList, languageResponse] = await Promise.all([
          getUsuario(userId),
          getPaises(),
          getPreferredLanguage(userId).catch(() => null),
        ]);
        const formData = {
          nombreCompleto: user.nombreCompleto || user.NombreCompleto || "",
          mail: user.mail || user.Mail || user.correo || user.Correo || "",
          contrasena: "",
          paisActual: user.paisActual || user.PaisActual || user.paisID || user.PaisID || "",
          idioma: normalizeLanguageCode(preferredCode(languageResponse)),
        };
        setForm(formData);
        setPaises(countryList);
        applyPreferredLanguage(languageResponse);

        let photoUrl = "";
        try {
          const photoResponse = await getFotoPerfil(userId);
          photoUrl = photoResponse.fotoPerfil || "";
          setFotoPreview(photoUrl);
          localStorage.setItem("fotoPerfil", photoUrl);
        } catch (photoError) {
          console.warn("No se pudo cargar la foto de perfil:", photoError);
        }
        guardarCache(cacheKey, { form: formData, paises: countryList, fotoPreview: photoUrl });
      } catch {
        setMessage("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const saveUserChanges = async (changes) => {
    if (!userId || !Object.keys(changes).length) return;
    setSaving(true);
    setMessage("Guardando...");
    try {
      await updateUsuario(userId, {
        nombreCompleto: changes.nombreCompleto ?? form.nombreCompleto,
        paisActual: changes.paisActual ?? form.paisActual,
        ...changes,
      });
      if (changes.fotoPerfil) {
        setFotoPreview(changes.fotoPerfil);
        localStorage.setItem("fotoPerfil", changes.fotoPerfil);
      }
      const updatedUser = await getUsuario(userId).catch(() => null);
      if (updatedUser) localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.removeItem(`perfil_cache_${userId}`);
      localStorage.removeItem(`home_cache_${userId}`);
      setMessage("Guardado automáticamente");
      if (changes.contrasena) updateForm("contrasena", "");
    } catch {
      setMessage("No se pudo guardar el cambio");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    prepareProfileImage(file)
      .then((photo) => saveUserChanges({ fotoPerfil: photo }))
      .catch(() => setMessage("No se pudo procesar la imagen seleccionada"));
    event.target.value = "";
  };

  const handleLanguageChange = async (event) => {
    const language = normalizeLanguageCode(event.target.value);
    updateForm("idioma", language);
    setSaving(true);
    setMessage("Guardando idioma...");
    try {
      const response = await updatePreferredLanguage({ usuarioId: Number(userId), codigoIdioma: language });
      const savedLanguage = normalizeLanguageCode(preferredCode(response));
      updateForm("idioma", savedLanguage);
      setPreferredLanguage(savedLanguage);
      await translatePage(savedLanguage);
      setMessage("Idioma guardado");
    } catch {
      setMessage("No se pudo guardar el idioma");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-container"><p className="profile-loading">Cargando perfil...</p></div>;

  return (
    <div className="profile-container">
      <section className="profile-hero">
        <div className="profile-hero__glow" aria-hidden="true" />
        <h1 className="profile-title" data-translate="Editar Perfil">Editar Perfil</h1>
        <p className="profile-subtitle" data-translate="Actualiza tu información personal y preferencias de cuenta.">
          Actualiza tu información personal y preferencias de cuenta.
        </p>
        <div className="profile-image" onClick={() => fileRef.current?.click()} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && fileRef.current?.click()}>
          {fotoPreview ? <img src={fotoPreview} alt="Perfil" /> : <span className="profile-image__fallback">U</span>}
          <span className="profile-image__badge" aria-hidden="true">✎</span>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} hidden />
        <button className="change-photo" type="button" onClick={() => fileRef.current?.click()} data-translate="Cambiar foto">
          Cambiar foto
        </button>
      </section>

      {message && <p className={`profile-message${message.includes("No se pudo") ? " profile-message--error" : ""}`} role="status">{message}</p>}

      <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
        <div className="profile-form__intro">
          <span className="profile-form__eyebrow">Cuenta</span>
          <p>Los cambios se guardan automáticamente.</p>
        </div>

        <label data-translate="Nombre completo">Nombre completo</label>
        <input type="text" placeholder="Ingrese su nombre completo" value={form.nombreCompleto} onChange={(event) => updateForm("nombreCompleto", event.target.value)} onBlur={() => form.nombreCompleto.trim() && saveUserChanges({ nombreCompleto: form.nombreCompleto.trim() })} />

        <label>Correo electrónico</label>
        <input type="email" value={form.mail} readOnly className="profile-input-readonly" />

        <label>País actual</label>
        <select value={form.paisActual} onChange={(event) => { updateForm("paisActual", event.target.value); saveUserChanges({ paisActual: event.target.value }); }} className="profile-form-select">
          <option value="">Seleccionar país</option>
          {paises.map((country) => <option key={country.ID} value={country.ID}>{country.nombre}</option>)}
        </select>

        <label data-translate="Idioma preferido">Idioma preferido</label>
        <select value={form.idioma} onChange={handleLanguageChange} className="profile-form-select" disabled={saving}>
          {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
        </select>

        <label>Contraseña</label>
        <div className="contrasena-box">
          <input type={showcontrasena ? "text" : "password"} placeholder="Ingrese una nueva contraseña" value={form.contrasena} onChange={(event) => updateForm("contrasena", event.target.value)} onBlur={() => form.contrasena && saveUserChanges({ contrasena: form.contrasena })} />
          <button type="button" onClick={() => setShowcontrasena((visible) => !visible)} aria-label="Mostrar contraseña">
            {showcontrasena ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </form>

      <button onClick={() => {
        ["token", "userId", "user", "fotoPerfil", "preferredLanguage"].forEach((key) => localStorage.removeItem(key));
        navigate("/");
      }} className="logout">
        <FaSignOutAlt />
        Cerrar sesión
      </button>

      <section className="preferences">
        <h3 data-translate="Accesos rápidos">Accesos rápidos</h3>
        <div className="preferences-buttons">
          <Link to="/clima" className="pref-btn"><FaTemperatureHigh /><span data-translate="Clima">Clima</span></Link>
          <Link to="/idioma" className="pref-btn"><FaGlobe /><span data-translate="Idioma">Idioma</span></Link>
          <Link to="/documentacion" className="pref-btn"><FaBook /><span data-translate="Documentación">Documentación</span></Link>
        </div>
      </section>
    </div>
  );
}
