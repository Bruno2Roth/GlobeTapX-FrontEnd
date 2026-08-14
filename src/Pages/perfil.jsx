import { useCallback, useEffect, useRef, useState } from "react";
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
import { getLanguageCatalog, getPreferredLanguage, updatePreferredLanguage } from "../services/languageService";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCatalog,
  resolveLanguageSelection,
  localizeCountryName,
  setPreferredLanguage,
  translatePage,
} from "../helpers/translatePage";
import { CONNECTION_ERROR_MESSAGE, getUserFacingError } from "../helpers/errorMessages";
import { obtenerCache } from "../helpers/cache";
import { clearAuthSession, getAuthSession, setAuthSession, subscribeAuthSession } from "../services/authSession";
import { getCachedUserProfile } from "../services/userProfileService";
import "../Styles/perfil.css";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function unwrapUser(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

function photoFromResponse(response) {
  const payload = response?.data ?? response;
  const data = payload?.data ?? payload;
  return typeof data?.fotoPerfil === "string" ? data.fotoPerfil : "";
}

function countriesFromResponse(response) {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : payload?.data || payload?.items || [];
}

function countryId(country) {
  return country?.ID ?? country?.id ?? country?.paisId ?? country?.idPais;
}

function formFromUser(user, languageSelection) {
  const selection = languageSelection || resolveLanguageSelection(user);
  const rawCountry = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  return {
    nombreCompleto: user?.nombreCompleto || user?.NombreCompleto || "",
    mail: user?.mail || user?.Mail || user?.correo || user?.Correo || "",
    contrasena: "",
    paisActual: rawCountry === "" || rawCountry === null || rawCountry === undefined ? "" : String(rawCountry),
    idiomaId: selection.idiomaId,
    // Se conserva el código para compatibilidad visual y con cachés anteriores.
    idioma: selection.codigoIdioma,
  };
}

function formFromCache(form, user) {
  const selection = resolveLanguageSelection({
    idiomaId: form?.idiomaId,
    codigoIdioma: form?.idioma || user?.idiomaPreferido,
  });
  const rawCountry = form?.paisActual ?? "";
  return {
    ...formFromUser(user || {}, selection),
    ...form,
    paisActual: rawCountry === "" || rawCountry === null || rawCountry === undefined ? "" : String(rawCountry),
    idiomaId: selection.idiomaId,
    idioma: selection.codigoIdioma,
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const fileRef = useRef();
  const [usuario, setUsuario] = useState(() => getCachedUserProfile(userId));
  const [form, setForm] = useState({
    nombreCompleto: "",
    mail: "",
    contrasena: "",
    paisActual: "",
    idiomaId: 1,
    idioma: "es",
  });
  const [idiomas, setIdiomas] = useState(LANGUAGE_OPTIONS);
  const [paises, setPaises] = useState([]);
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fotoPreview, setFotoPreview] = useState(() => getAuthSession().photo || "");
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState("");
  const [countriesRetry, setCountriesRetry] = useState(0);
  const [profileRetry, setProfileRetry] = useState(0);
  const languageChangeVersion = useRef(0);

  useEffect(() => subscribeAuthSession((session) => {
    if (!session.user || String(session.user.id) === String(userId)) {
      setUsuario(session.user);
      setFotoPreview(session.photo || "");
    }
  }), [userId]);

  const loadCountries = useCallback(async (isActive = () => true) => {
    setCountriesLoading(true);
    setCountriesError("");
    try {
      const countries = countriesFromResponse(await getPaises());
      if (!isActive()) return;
      setPaises(countries);
      setCountriesError("");
    } catch (error) {
      if (!isActive()) return;
      setCountriesError(getUserFacingError(error));
    } finally {
      if (isActive()) setCountriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!countriesRetry || !usuario?.id) return;
    void loadCountries();
  }, [countriesRetry, loadCountries, usuario?.id]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    if (profileRetry) {
      setMessage("");
      setLoading(true);
    }
    const cacheKey = `perfil_cache_${userId}`;
    const cache = obtenerCache(cacheKey);
    const sessionUser = getAuthSession().user;
    const cachedUser = sessionUser?.id ? sessionUser : getCachedUserProfile(userId);

    if (cache?.data?.form) {
      setUsuario(cachedUser);
      setForm(formFromCache(cache.data.form, cachedUser));
      setPaises(cache.data.paises || []);
      setFotoPreview(getAuthSession().photo || "");
      setLoading(false);
    } else if (cachedUser?.id) {
      const sessionLanguage = resolveLanguageSelection(cachedUser);
      setUsuario(cachedUser);
      setForm(formFromUser(cachedUser, sessionLanguage));
      // fotoPerfil de /auth/me es una ruta de lectura, no una URL firmada.
      setFotoPreview(getAuthSession().photo || "");
      setLoading(false);
    }

    const loadProfile = async () => {
      try {
        // Esta es la única solicitud crítica para pintar los datos básicos.
        const profileResponse = await getCurrentUser();
        const serverUser = unwrapUser(profileResponse);
        if (!serverUser?.id) throw new Error(CONNECTION_ERROR_MESSAGE);
        if (!active) return;

        const initialLanguage = resolveLanguageSelection(serverUser);
        const initialForm = formFromUser(serverUser, initialLanguage);
        setUsuario(serverUser);
        setForm(initialForm);
        setAuthSession(serverUser, getAuthSession().photo || "");
        setLoading(false);

        const loadPhoto = async () => {
          try {
            const photoResponse = await getFotoPerfil(serverUser.id);
            if (!active) return;
            // 200 + fotoPerfil:null es un estado válido: se mantiene el placeholder.
            const photo = photoFromResponse(photoResponse);
            setFotoPreview(photo);
            setAuthSession(serverUser, photo);
          } catch (error) {
            if (active) console.warn("No se pudo cargar la foto de perfil:", error);
          }
        };

        const loadLanguage = async () => {
          const requestVersion = languageChangeVersion.current;
          const [catalogResult, preferenceResult] = await Promise.allSettled([
            getLanguageCatalog(),
            getPreferredLanguage(serverUser.id),
          ]);
          if (!active) return;

          const catalog = catalogResult.status === "fulfilled"
            ? normalizeLanguageCatalog(catalogResult.value)
            : [];
          if (catalog.length) setIdiomas(catalog);
          // No sobrescribir una elección hecha por el usuario mientras esta
          // carga secundaria todavía estaba pendiente.
          if (languageChangeVersion.current !== requestVersion) return;

          const preferred = preferenceResult.status === "fulfilled"
            ? preferenceResult.value
            : serverUser;
          const selection = resolveLanguageSelection(preferred, catalog);
          setForm((previous) => ({
            ...previous,
            idiomaId: selection.idiomaId,
            idioma: selection.codigoIdioma,
          }));
          setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);

          if (catalogResult.status === "rejected" || preferenceResult.status === "rejected") {
            const secondaryError = catalogResult.status === "rejected"
              ? catalogResult.reason
              : preferenceResult.reason;
            setMessage(getUserFacingError(secondaryError));
          }

          // La carga de tags y la aplicación de traducciones ocurre después del render inicial.
          try {
            await translatePage(selection.idiomaId);
          } catch (error) {
            if (active) console.warn("No se pudo traducir el perfil:", error);
          }
        };

        // Recursos secundarios independientes: ninguno retrasa el render de los datos básicos.
        void Promise.allSettled([
          loadPhoto(),
          loadLanguage(),
          loadCountries(() => active),
        ]);
      } catch (error) {
        if (!active) return;
        console.warn("No se pudo cargar el perfil:", error);
        setMessage(getUserFacingError(error));
        setLoading(false);
      }
    };

    void loadProfile();
    return () => { active = false; };
  }, [loadCountries, profileRetry, userId]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const saveUserChanges = async (changes) => {
    const currentUserId = usuario?.id ?? userId;
    const safeChanges = Object.fromEntries(
      Object.entries(changes).filter(([key]) => !["idiomaId", "codigoIdioma", "idioma"].includes(key)),
    );
    if (!currentUserId || !Object.keys(safeChanges).length) return;
    setSaving(true);
    setMessage("Guardando...");
    try {
      await updateUsuario(currentUserId, {
        nombreCompleto: safeChanges.nombreCompleto ?? form.nombreCompleto,
        paisActual: safeChanges.paisActual ?? form.paisActual,
        ...safeChanges,
      });
      const updatedUser = unwrapUser(await getCurrentUser().catch(() => null));
      if (updatedUser?.id) {
        setUsuario(updatedUser);
        setAuthSession(updatedUser, fotoPreview);
      }
      localStorage.removeItem(`perfil_cache_${currentUserId}`);
      localStorage.removeItem(`home_cache_${currentUserId}`);
      setMessage("Guardado automáticamente");
      if (safeChanges.contrasena) updateForm("contrasena", "");
    } catch (error) {
      setMessage(getUserFacingError(error));
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
      .then(() => getFotoPerfil(currentUserId).catch(() => null))
      .then((photoResponse) => {
        // Se vuelve a solicitar la URL de lectura; nunca se usa una ruta de /auth/me.
        const photo = photoFromResponse(photoResponse);
        setUsuario((previous) => ({ ...(previous || {}), fotoPerfil: photo }));
        setFotoPreview(photo);
        setAuthSession({ ...(usuario || {}), id: currentUserId }, photo);
        localStorage.removeItem(`perfil_cache_${currentUserId}`);
        setMessage("Foto guardada");
      })
      .catch((error) => {
        console.error("Profile photo upload failed", error);
        setMessage(getUserFacingError(error));
      })
      .finally(() => setSaving(false));
    event.target.value = "";
  };

  const handleLanguageChange = async (event) => {
    const selection = resolveLanguageSelection(event.target.value, idiomas);
    const changeVersion = languageChangeVersion.current + 1;
    languageChangeVersion.current = changeVersion;
    const rawUserId = usuario?.id ?? userId;
    const usuarioId = Number.isNaN(Number(rawUserId)) ? rawUserId : Number(rawUserId);

    // La pantalla responde de inmediato; el guardado en backend es secundario.
    setForm((previous) => ({
      ...previous,
      idiomaId: selection.idiomaId,
      idioma: selection.codigoIdioma,
    }));
    setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);
    setAuthSession({
      ...(usuario || {}),
      id: rawUserId,
      idiomaPreferido: { idiomaId: selection.idiomaId, codigoIdioma: selection.codigoIdioma },
    }, fotoPreview);
    void translatePage(selection.idiomaId).catch((translationError) => {
      console.warn("No se pudo actualizar el catálogo de traducciones:", translationError);
    });

    setSaving(true);
    setMessage("Guardando idioma...");
    try {
      await updatePreferredLanguage({ usuarioId, idiomaId: selection.idiomaId });
      if (languageChangeVersion.current === changeVersion) setMessage("Idioma guardado");
    } catch (error) {
      console.error("Preferred language update failed", error);
      if (languageChangeVersion.current === changeVersion) setMessage(getUserFacingError(error));
    } finally {
      if (languageChangeVersion.current === changeVersion) setSaving(false);
    }
  };

  if (loading) return <div className="profile-container"><p className="profile-loading">Cargando perfil...</p></div>;

  return (
    <div className="profile-container">
      <section className="profile-hero">
        <div className="profile-hero__glow" aria-hidden="true" />
        <h1 className="profile-title" data-translate-id="1" data-translate="Editar Perfil">Perfil</h1>
        <p className="profile-subtitle" data-translate="Actualiza tu información personal y preferencias de cuenta.">
          Actualiza tu información personal y preferencias de cuenta.
        </p>
        <div className="profile-image" onClick={() => fileRef.current?.click()} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && fileRef.current?.click()}>
          {fotoPreview ? <img src={fotoPreview} alt="Perfil" /> : <span className="profile-image__fallback">U</span>}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handlePhoto} hidden />
      </section>

      {message && <>
        <p className={`profile-message${message === CONNECTION_ERROR_MESSAGE ? " profile-message--error" : ""}`} role="status">{message}</p>
        {message.includes("Puedes reintentar") && <button type="button" className="profile-primary-retry" onClick={() => setProfileRetry((value) => value + 1)}>Reintentar</button>}
      </>}

      <form className="profile-form" aria-busy={saving} onSubmit={(event) => event.preventDefault()}>
        <div className="profile-form__intro">
          <span className="profile-form__eyebrow">Cuenta</span>
          <p>Los cambios se guardan automáticamente.</p>
        </div>

        <label data-translate-id="2" data-translate="Nombre completo">Nombre completo</label>
        <input type="text" placeholder="Ingrese su nombre completo" value={form.nombreCompleto} onChange={(event) => updateForm("nombreCompleto", event.target.value)} onBlur={() => form.nombreCompleto.trim() && saveUserChanges({ nombreCompleto: form.nombreCompleto.trim() })} />

        <label data-translate-id="3">Correo electrónico</label>
        <input type="email" value={form.mail} readOnly className="profile-input-readonly" />

        <label data-translate-id="4">País actual</label>
        <select value={form.paisActual} onChange={(event) => { updateForm("paisActual", event.target.value); saveUserChanges({ paisActual: event.target.value }); }} className="profile-form-select">
          <option
            value=""
            disabled={countriesLoading}
            data-translate-id={countriesLoading ? "30" : "29"}
          >
            {countriesLoading ? "Cargando países..." : countriesError ? "No se pudieron cargar los países" : "Seleccionar país"}
          </option>
          {paises.map((country) => {
            const name = country.nombre || country.name || "";
            const code = country.codigo || country.code || "";
            return (
              <option
                key={countryId(country)}
                value={countryId(country)}
                data-country-code={code || undefined}
              >
                {localizeCountryName(code, name)}
              </option>
            );
          })}
        </select>
        {countriesError && <button type="button" className="profile-secondary-retry" onClick={() => setCountriesRetry((value) => value + 1)}>Reintentar países</button>}

        <label data-translate-id="5" data-translate="Idioma preferido">Idioma preferido</label>
        <select value={String(form.idiomaId)} onChange={handleLanguageChange} className="profile-form-select">
          {idiomas.map((language) => <option key={language.idiomaId} value={language.idiomaId}>{language.name}</option>)}
        </select>

        <label data-translate-id="21">Contraseña</label>
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
