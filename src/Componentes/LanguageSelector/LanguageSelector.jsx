import { useEffect, useState } from "react";
import { getLanguageCatalog, getPreferredLanguage, updatePreferredLanguage } from "../../services/languageService";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCatalog,
  resolveLanguageSelection,
  setPreferredLanguage,
  translatePage,
} from "../../helpers/translatePage";
import { CONNECTION_ERROR_MESSAGE, getUserFacingError } from "../../helpers/errorMessages";
import { getAuthSession, setAuthSession } from "../../services/authSession";
import "./index.css";

function getUserId() {
  return getAuthSession().user?.id ?? localStorage.getItem("userId");
}

function initialLanguageSelection() {
  return resolveLanguageSelection({
    idiomaId: localStorage.getItem("preferredLanguageId"),
    codigoIdioma: localStorage.getItem("preferredLanguage") || document.documentElement.lang || "es",
  });
}

export default function LanguageSelector({ className = "" }) {
  const userId = getUserId();
  const [languages, setLanguages] = useState(LANGUAGE_OPTIONS);
  const [selectedLanguageId, setSelectedLanguageId] = useState(() => String(initialLanguageSelection().idiomaId));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const preferenceRequest = userId ? getPreferredLanguage(userId) : Promise.resolve(null);
    Promise.allSettled([getLanguageCatalog(), preferenceRequest]).then(([catalogResult, preferenceResult]) => {
      if (!active) return;

      const catalog = catalogResult.status === "fulfilled" ? normalizeLanguageCatalog(catalogResult.value) : [];
      if (catalog.length) setLanguages(catalog);

      const preferred = preferenceResult.status === "fulfilled" && preferenceResult.value
        ? preferenceResult.value
        : initialLanguageSelection();
      const selection = resolveLanguageSelection(preferred, catalog);
      setSelectedLanguageId(String(selection.idiomaId));
      setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);

      void translatePage(selection.idiomaId).catch((translationError) => {
        if (active) setError(getUserFacingError(translationError));
      });

      if (catalogResult.status === "rejected" || preferenceResult.status === "rejected") {
        setError(getUserFacingError(catalogResult.reason || preferenceResult.reason));
      }
    });

    return () => { active = false; };
  }, [userId]);

  const handleChange = async (event) => {
    const nextLanguage = resolveLanguageSelection(event.target.value, languages);
    const rawUserId = getUserId();
    setError("");

    try {
      if (!rawUserId) throw new Error(CONNECTION_ERROR_MESSAGE);
      const numericUserId = Number(rawUserId);
      await updatePreferredLanguage({
        usuarioId: Number.isNaN(numericUserId) ? rawUserId : numericUserId,
        idiomaId: nextLanguage.idiomaId,
      });

      // El selector y la caché solo cambian después de que el PUT terminó en 2xx.
      setSelectedLanguageId(String(nextLanguage.idiomaId));
      setPreferredLanguage(nextLanguage.codigoIdioma, nextLanguage.idiomaId);
      await translatePage(nextLanguage.idiomaId);

      const currentUser = getAuthSession().user;
      if (currentUser?.id) {
        setAuthSession({
          ...currentUser,
          idiomaPreferido: { idiomaId: nextLanguage.idiomaId, codigoIdioma: nextLanguage.codigoIdioma },
        }, getAuthSession().photo);
      }
    } catch (changeError) {
      console.error("Preferred language update failed", changeError);
      setError(getUserFacingError(changeError));
    }
  };

  return (
    <label className={`language-selector-control ${className}`.trim()}>
      <span className="language-selector-control__label" data-translate="Idioma">Idioma</span>
      <select id="language-selector" value={selectedLanguageId} onChange={handleChange} aria-label="Seleccionar idioma de la interfaz">
        {languages.map((language) => (
          <option key={language.idiomaId} value={language.idiomaId}>{language.name}</option>
        ))}
      </select>
      {error && <small className="language-selector-control__error">{error}</small>}
    </label>
  );
}
