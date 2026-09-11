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
import { getPaises, getLanguageCatalog } from "../services/backendApi";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCatalog,
  resolveLanguageSelection,
  localizeCountryName,
  setPreferredLanguage,
  translatePage,
} from "../helpers/translatePage";
import { CONNECTION_ERROR_MESSAGE, getUserFacingError } from "../helpers/errorMessages";
import { useSession } from "../context/SessionContext";
import "../Styles/perfil.css";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function normalizeCountryValue(value) {
  if (value === null || value === undefined || value === "") return "";
  const normalized = String(value).trim();
  return normalized === "null" || normalized === "undefined" ? "" : normalized;
}

function countriesFromResponse(response) {
  const payload = response?.data ?? response;
  const candidate = Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? payload?.results ?? [];
  return Array.isArray(candidate) ? candidate : [];
}

function countryId(country) {
  const id = country?.ID ?? country?.id ?? country?.paisId ?? country?.idPais ?? country?.paisactual ?? country?.paisActual;
  return id === null || id === undefined || id === "" ? "" : String(id);
}

function formFromUser(user, languageSelection) {
  const selection = languageSelection || resolveLanguageSelection(user);
  const rawCountry = user?.paisActual ?? user?.PaisActual ?? user?.paisactual ?? user?.Paisactual ?? user?.paisID ?? user?.PaisID ?? "";
  return {
    nombreCompleto: user?.nombreCompleto || user?.NombreCompleto || "",
    mail: user?.mail || user?.Mail || user?.correo || user?.Correo || "",
    paisActual: normalizeCountryValue(rawCountry),
    idiomaId: selection.idiomaId,
    // Se conserva el código para compatibilidad visual y con cachés anteriores.
    idioma: selection.codigoIdioma,
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    photo,
    loading: sessionLoading,
    updateUser,
    updatePhoto,
    updateLanguage,
    logout,
  } = useSession();
  const fileRef = useRef();
  const [form, setForm] = useState({
    nombreCompleto: "",
    mail: "",
    paisActual: "",
    idiomaId: 1,
    idioma: "es",
  });
  const [idiomas, setIdiomas] = useState(LANGUAGE_OPTIONS);
  const [paises, setPaises] = useState([]);
  const [showcontrasena, setShowcontrasena] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState("");
  const [countriesRetry, setCountriesRetry] = useState(0);
  const languageChangeVersion = useRef(0);

  const countryOptions = Array.isArray(paises) ? paises : [];
  const countrySelectDisabled = countriesLoading || !!countriesError || countryOptions.length === 0;
  const countryPlaceholder = countriesLoading
    ? "Cargando países..."
    : countriesError
      ? "No se pudieron cargar los países"
      : countryOptions.length === 0
        ? "Sin países disponibles"
        : "Seleccionar país";

  const loadCountries = useCallback(async (isActive = () => true) => {
    setCountriesLoading(true);
    setCountriesError("");
    try {
      const response = await getPaises();
      if (!isActive()) return;
      const countries = countriesFromResponse(response);
      setPaises(countries);
      if (!countries.length) {
        setCountriesError("");
      }
    } catch (error) {
      if (!isActive()) return;
      setPaises([]);
      setCountriesError(getUserFacingError(error));
    } finally {
      if (isActive()) setCountriesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!countriesRetry || !user?.id) return;
    void loadCountries();
  }, [countriesRetry, loadCountries, user?.id]);

  useEffect(() => {
    if (user) setForm(formFromUser(user));
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
    const requestVersion = languageChangeVersion.current;

    getLanguageCatalog().then((catalogResponse) => {
      if (!active || languageChangeVersion.current !== requestVersion) return;

      const catalog = normalizeLanguageCatalog(catalogResponse);
      if (catalog.length) setIdiomas(catalog);

      const selection = resolveLanguageSelection(user, catalog);
      setForm((previous) => ({ ...previous, idiomaId: selection.idiomaId, idioma: selection.codigoIdioma }));
      setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);

      void translatePage(selection.idiomaId).catch((translationError) => {
        if (active) console.warn("No se pudo traducir el perfil:", translationError);
      });
    }).catch((catalogError) => {
      if (active) setMessage(getUserFacingError(catalogError));
    });

    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    void loadCountries();
    return undefined;
  }, [loadCountries, user]);

  const updateForm = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const saveUserChanges = async (changes) => {
    const safeChanges = Object.fromEntries(
      Object.entries(changes).filter(([key]) => !["idiomaId", "codigoIdioma", "idioma"].includes(key)),
    );
    if (!user || !Object.keys(safeChanges).length) return;

    const countryValue = safeChanges.paisActual ?? safeChanges.paisactual ?? form.paisActual;
    const payload = {
      ...safeChanges,
      ...(countryValue !== undefined && countryValue !== null ? { paisActual: String(countryValue), paisactual: String(countryValue) } : {}),
    };

    setSaving(true);
    setMessage("Guardando...");
    try {
      const updatedUser = await updateUser(payload);
      setForm(formFromUser(updatedUser));
      setMessage("Guardado automáticamente");
    } catch (error) {
      setMessage(getUserFacingError(error));
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
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
    updatePhoto(file)
      .then(() => {
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

    setForm((previous) => ({
      ...previous,
      idiomaId: selection.idiomaId,
      idioma: selection.codigoIdioma,
    }));
    setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);
    void Promise.resolve()
      .then(() => translatePage(selection.idiomaId))
      .catch((translationError) => {
        console.warn("No se pudo actualizar el catálogo de traducciones:", translationError);
      });

    setSaving(true);
    setMessage("Guardando idioma...");
    try {
      const updatedUser = await updateLanguage(selection);
      if (languageChangeVersion.current === changeVersion) {
        const applied = resolveLanguageSelection(updatedUser?.idiomaPreferido || selection, idiomas);
        setForm((previous) => ({ ...previous, idiomaId: applied.idiomaId, idioma: applied.codigoIdioma }));
        setPreferredLanguage(applied.codigoIdioma, applied.idiomaId);
        void translatePage(applied.idiomaId).catch((translationError) => {
          console.warn("No se pudo actualizar el catálogo de traducciones:", translationError);
        });
        setMessage("Idioma guardado");
      }
    } catch (error) {
      console.error("Preferred language update failed", error);
      if (languageChangeVersion.current === changeVersion) {
        const previous = resolveLanguageSelection(user, idiomas);
        setForm((current) => ({ ...current, idiomaId: previous.idiomaId, idioma: previous.codigoIdioma }));
        setPreferredLanguage(previous.codigoIdioma, previous.idiomaId);
        void translatePage(previous.idiomaId).catch(() => {});
        setMessage(getUserFacingError(error));
      }
    } finally {
      if (languageChangeVersion.current === changeVersion) setSaving(false);
    }
  };

  if (sessionLoading || !user) return <div className="profile-container"><p className="profile-loading">Cargando perfil...</p></div>;

  return (
    <div className="profile-container">
      <section className="profile-hero">
        <div className="profile-hero__glow" aria-hidden="true" />
        <h1 className="profile-title" data-translate-id="1" data-translate="Editar Perfil">Perfil</h1>
        <p className="profile-subtitle" data-translate="Actualiza tu información personal y preferencias de cuenta.">
          Actualiza tu información personal y preferencias de cuenta.
        </p>
        <div className="profile-image" onClick={() => fileRef.current?.click()} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && fileRef.current?.click()}>
          {photo ? <img src={photo} alt="Perfil" /> : <span className="profile-image__fallback">U</span>}
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handlePhoto} hidden />
      </section>

      {message && <>
        <p className={`profile-message${message === CONNECTION_ERROR_MESSAGE ? " profile-message--error" : ""}`} role="status">{message}</p>
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
        <select
          value={form.paisActual ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            updateForm("paisActual", nextValue);
            saveUserChanges({ paisActual: nextValue, paisactual: nextValue });
          }}
          className="profile-form-select"
          disabled={countrySelectDisabled}
        >
          <option value="" disabled={countriesLoading}>
            {countryPlaceholder}
          </option>
          {countryOptions.map((country) => {
            const value = countryId(country);
            const name = country?.nombre ?? country?.name ?? "";
            const code = country?.codigo ?? country?.code ?? "";
            if (!value) return null;
            return (
              <option
                key={value}
                value={value}
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
        <div className="contrasena-box" style={{ display: "none" }}>
          <input type={showcontrasena ? "text" : "password"} placeholder="Ingrese una nueva contraseña" value={form.contrasena} onChange={(event) => updateForm("contrasena", event.target.value)} onBlur={() => form.contrasena && saveUserChanges({ contrasena: form.contrasena })} />
          <button type="button" onClick={() => setShowcontrasena((visible) => !visible)} aria-label="Mostrar contraseña">
            {showcontrasena ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </form>

      <button onClick={() => {
         logout();
        navigate("/");
      }} className="logout">
        <FaSignOutAlt />
        Cerrar sesión
      </button>

      <section className="preferences" style={{ display: "none" }}>
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
