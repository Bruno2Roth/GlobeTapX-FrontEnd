import { useEffect, useState } from "react";
import { getPreferredLanguage, getSupportedLanguages, updatePreferredLanguage } from "../../services/languageService";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCode,
  normalizeSupportedLanguages,
  setPreferredLanguage,
  translatePage,
} from "../../helpers/translatePage";
import { CONNECTION_ERROR_MESSAGE } from "../../helpers/errorMessages";
import { getAuthSession, setAuthSession } from "../../services/authSession";
import "./index.css";

function preferredCode(response) {
  const payload = response?.data ?? response;
  if (typeof payload === "string") return payload;
  const preferred = payload?.idiomaPreferido;
  return payload?.codigoIdioma || (typeof preferred === "object" ? preferred.codigoIdioma : preferred) || payload?.idioma || payload?.code || "";
}

function getUserId() {
  return getAuthSession().user?.id ?? localStorage.getItem("userId");
}

export default function LanguageSelector({ className = "" }) {
  const userId = getUserId();
  const [languages, setLanguages] = useState(LANGUAGE_OPTIONS);
  const [selectedLanguage, setSelectedLanguage] = useState(() => normalizeLanguageCode(
    localStorage.getItem("preferredLanguage") || document.documentElement.lang || "es",
  ));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getSupportedLanguages()
      .then((response) => {
        const list = normalizeSupportedLanguages(response);
        if (active && list.length) setLanguages(list);
      })
      .catch(() => {
        if (active) setError(CONNECTION_ERROR_MESSAGE);
      });

    if (!userId) return () => { active = false; };

    getPreferredLanguage(userId)
      .then(async (response) => {
        if (!active) return;
        const preferred = normalizeLanguageCode(preferredCode(response));
        setSelectedLanguage(preferred);
        try {
          await translatePage(preferred);
          if (active) setPreferredLanguage(preferred);
        } catch {
          if (active) setError(CONNECTION_ERROR_MESSAGE);
        }
      })
      .catch(() => {
        if (active) setError(CONNECTION_ERROR_MESSAGE);
      });

    return () => { active = false; };
  }, [userId]);

  const handleChange = async (event) => {
    const nextLanguage = normalizeLanguageCode(event.target.value);
    const rawUserId = getUserId();
    setError("");

    try {
      if (!rawUserId) throw new Error(CONNECTION_ERROR_MESSAGE);
      const numericUserId = Number(rawUserId);
      await updatePreferredLanguage({
        usuarioId: Number.isNaN(numericUserId) ? rawUserId : numericUserId,
        codigoIdioma: nextLanguage,
      });

      // El selector y la caché solo cambian después de que el PUT terminó en 2xx.
      setSelectedLanguage(nextLanguage);
      setPreferredLanguage(nextLanguage);
      await translatePage(nextLanguage);

      const currentUser = getAuthSession().user;
      if (currentUser?.id) {
        setAuthSession({ ...currentUser, idiomaPreferido: nextLanguage }, getAuthSession().photo);
      }
    } catch (changeError) {
      console.error("Preferred language update failed", changeError);
      setError(CONNECTION_ERROR_MESSAGE);
    }
  };

  return (
    <label className={`language-selector-control ${className}`.trim()}>
      <span className="language-selector-control__label" data-translate="Idioma">Idioma</span>
      <select id="language-selector" value={selectedLanguage} onChange={handleChange} aria-label="Seleccionar idioma de la interfaz">
        {languages.map((language) => (
          <option key={language.code} value={language.code}>{language.name}</option>
        ))}
      </select>
      {error && <small className="language-selector-control__error">{error}</small>}
    </label>
  );
}
