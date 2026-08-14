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
import { getCurrentUser, getFotoPerfil, getPaises, updateUsuario, uploadFotoPerfil } from "../config";
import { getPreferredLanguage, updatePreferredLanguage } from "../services/languageService";
import { LANGUAGE_OPTIONS, normalizeLanguageCode, setPreferredLanguage, translatePage } from "../helpers/translatePage";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { obtenerCache, guardarCache } from "../helpers/cache";
import { clearAuthSession, getAuthSession, setAuthSession, subscribeAuthSession } from "../services/authSession";
import "../Styles/perfil.css";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function preferredCode(response) {
  const payload = response?.data ?? response;
  if (typeof payload === "string") return payload;
  const preferred = payload?.idiomaPreferido;
  return payload?.codigoIdioma || (typeof preferred === "object" ? preferred.codigoIdioma : preferred) || payload?.idioma || payload?.code || "es";
}

function photoFromResponse(response) {
  const payload = response?.data ?? response;
  return typeof payload?.fotoPerfil === "string" ? payload.fotoPerfil : "";
}

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const fileRef = useRef();
  const [usuario, setUsuario] = useState(() => getAuthSession().user);
  const [form, setForm] = useState({ nombreCompleto: "", mail: "", contrasena: "", paisActual: "", idioma: "es" });
  const [paises, setPaises] = useState([]);
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fotoPreview, setFotoPreview] = useState(() => getAuthSession().photo || "");

  useEffect(() => subscribeAuthSession((session) => {
    if (!session.user || String(session.user.id) === String(userId)) {
      setUsuario(session.user);
      setFotoPreview(session.photo || "");
    }
  }), [userId]);

  const applyPreferredLanguage = async (response) => {
    if (!response) return;
    const language = normalizeLanguageCode(preferredCode(response));
    try {
      const appliedLanguage = await translatePage(language);
      setForm((previous) => ({ ...previous, idioma: appliedLanguage }));
      setPreferredLanguage(appliedLanguage);
    } catch (error) {
      console.warn("No se pudo traducir el perfil:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const cacheKey = `perfil_cache_${userId}`;
    const cache = obtenerCache(cacheKey);

    const loadProfile = async () => {
      try {
        const [user, countryList] = await Promise.all([
          getCurrentUser(),
          getPaises(),
        ]);
        const serverUser = user?.user || user?.data?.user || user?.data || user;
        if (!serverUser?.id) throw new Error(CONNECTION_ERROR_MESSAGE);
        const countries = Array.isArray(countryList) ? countryList : countryList?.data || countryList?.items || [];
        let languageResponse = null;
        try {
          languageResponse = await getPreferredLanguage(serverUser.id);
        } catch (languageError) {
          console.warn("No se pudo cargar el idioma preferido:", languageError);
          setMessage(CONNECTION_ERROR_MESSAGE);
        }
        const language = normalizeLanguageCode(
          languageResponse ? preferredCode(languageResponse) : preferredCode(serverUser),
        );
        const formData = {
          nombreCompleto: serverUser.nombreCompleto || serverUser.NombreCompleto || "",
          mail: serverUser.mail || serverUser.Mail || serverUser.correo || serverUser.Correo || "",
          contrasena: "",
          paisActual: serverUser.paisActual || serverUser.PaisActual || serverUser.paisID || serverUser.PaisID || "",
          idioma: language,
        };
        setUsuario(serverUser);
        setForm(formData);
        setPaises(countries);
        await applyPreferredLanguage({ codigoIdioma: language });

        let photoUrl = photoFromResponse(serverUser);
        try {
          const photoResponse = await getFotoPerfil(serverUser.id);
          photoUrl = photoFromResponse(photoResponse) || photoUrl;
        } catch (photoError) {
          console.warn("No se pudo cargar la foto de perfil:", photoError);
        }
        setFotoPreview(photoUrl);
        setAuthSession(serverUser, photoUrl);
        guardarCache(cacheKey, { form: formData, paises: countries, fotoPreview: "" });
      } catch (error) {
        console.warn("No se pudo cargar el perfil:", error);
        if (cache) {
          setUsuario(getAuthSession().user);
          setForm(cache.data.form);
          setPaises(cache.data.paises || []);
          setFotoPreview(getAuthSession().photo || "");
        }
        setMessage(CONNECTION_ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [userId]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const saveUserChanges = async (changes) => {
    const currentUserId = usuario?.id ?? userId;
    if (!currentUserId || !Object.keys(changes).length) return;
    setSaving(true);
    setMessage("Guardando...");
    try {
      await updateUsuario(currentUserId, {
        nombreCompleto: changes.nombreCompleto ?? form.nombreCompleto,
        paisActual: changes.paisActual ?? form.paisActual,
        ...changes,
      });
      const updatedUserResponse = await getCurrentUser().catch(() => null);
      const updatedUser = updatedUserResponse?.user || updatedUserResponse?.data?.user || updatedUserResponse?.data || updatedUserResponse;
      if (updatedUser?.id) {
        setUsuario(updatedUser);
        setAuthSession(updatedUser, fotoPreview);
      }
      localStorage.removeItem(`perfil_cache_${currentUserId}`);
      localStorage.removeItem(`home_cache_${currentUserId}`);
      setMessage("Guardado automáticamente");
      if (changes.contrasena) updateForm("contrasena", "");
    } catch {
      setMessage(CONNECTION_ERROR_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const currentUserId = usuario?.id ?? userId;
    if (!currentUserId) {
      setMessage(CONNECTION_ERROR_MESSAGE);
      event.target.value = "";
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
      setMessage("La foto debe ser JPG, PNG, WEBP, GIF o AVIF y pesar como máximo 5 MB.");
      event.target.value = "";
      return;
    }

    setSaving(true);
    setMessage("Guardando foto...");
    uploadFotoPerfil(currentUserId, file)
      .then((response) => {
        const photo = photoFromResponse(response);
        setUsuario((previous) => ({ ...(previous || {}), fotoPerfil: photo }));
        setFotoPreview(photo);
        setAuthSession({ ...(usuario || {}), id: currentUserId, fotoPerfil: photo }, photo);
        localStorage.removeItem(`perfil_cache_${currentUserId}`);
        setMessage("Foto guardada");
      })
      .catch((error) => {
        console.error("Profile photo upload failed", error);
        setMessage(CONNECTION_ERROR_MESSAGE);
      })
      .finally(() => setSaving(false));
    event.target.value = "";
  };

  const handleLanguageChange = async (event) => {
    const language = normalizeLanguageCode(event.target.value);
    setSaving(true);
    setMessage("Guardando idioma...");
    try {
      const rawUserId = usuario?.id ?? userId;
      const usuarioId = Number.isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);
      await updatePreferredLanguage({ usuarioId, codigoIdioma: language });
      updateForm("idioma", language);
      setPreferredLanguage(language);
      setAuthSession({ ...(usuario || {}), id: rawUserId, idiomaPreferido: language }, fotoPreview);
      await translatePage(language);
      setMessage("Idioma guardado");
    } catch (error) {
      console.error("Preferred language update failed", error);
      setMessage(CONNECTION_ERROR_MESSAGE);
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
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handlePhoto} hidden />
        <button className="change-photo" type="button" onClick={() => fileRef.current?.click()} data-translate="Cambiar foto">
          Cambiar foto
        </button>
      </section>

      {message && <p className={`profile-message${message === CONNECTION_ERROR_MESSAGE ? " profile-message--error" : ""}`} role="status">{message}</p>}

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
          {LANGUAGE_OPTIONS.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
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
        clearAuthSession();
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
