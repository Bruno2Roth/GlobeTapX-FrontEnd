import { useEffect, useRef, useState } from "react";
import { getLanguageCatalog } from "../../services/backendApi";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCatalog,
  resolveLanguageSelection,
  setPreferredLanguage,
  translatePage,
} from "../../helpers/translatePage";
import { getUserFacingError } from "../../helpers/errorMessages";
import { useSession } from "../../context/SessionContext";
import "./index.css";

function initialLanguageSelection(user) {
  const documentLanguage = typeof document !== "undefined" ? document.documentElement.lang : "es";
  return resolveLanguageSelection(
    user?.idiomaPreferido || documentLanguage || "es",
  );
}

export default function LanguageSelector({ className = "" }) {
  const { user, updateLanguage } = useSession();
  const [languages, setLanguages] = useState(LANGUAGE_OPTIONS);
  const [selectedLanguageId, setSelectedLanguageId] = useState(() => String(initialLanguageSelection(user).idiomaId));
  const [error, setError] = useState("");
  const languageChangeVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const requestVersion = languageChangeVersion.current;

    getLanguageCatalog().then((catalogResponse) => {
      if (!active || languageChangeVersion.current !== requestVersion) return;

      const catalog = normalizeLanguageCatalog(catalogResponse);
      if (catalog.length) setLanguages(catalog);

      const selection = resolveLanguageSelection(user || initialLanguageSelection(), catalog);
      setSelectedLanguageId(String(selection.idiomaId));
      setPreferredLanguage(selection.codigoIdioma, selection.idiomaId);
      void translatePage(selection.idiomaId).catch((translationError) => {
        if (active) setError(getUserFacingError(translationError));
      });
    }).catch((catalogError) => {
      if (active) setError(getUserFacingError(catalogError));
    });

    return () => { active = false; };
  }, [user]);

  const handleChange = async (event) => {
    const nextLanguage = resolveLanguageSelection(event.target.value, languages);
    const changeVersion = languageChangeVersion.current + 1;
    languageChangeVersion.current = changeVersion;
    setError("");
    setSelectedLanguageId(String(nextLanguage.idiomaId));

    try {
      if (!user) throw new Error("No hay una sesión activa");
      const updatedUser = await updateLanguage(nextLanguage);
      const applied = resolveLanguageSelection(updatedUser?.idiomaPreferido || nextLanguage, languages);
      setSelectedLanguageId(String(applied.idiomaId));
      setPreferredLanguage(applied.codigoIdioma, applied.idiomaId);
      void translatePage(applied.idiomaId).catch((translationError) => {
        console.warn("No se pudo actualizar el catálogo de traducciones:", translationError);
      });
    } catch (changeError) {
      console.error("Preferred language update failed", changeError);
      if (languageChangeVersion.current === changeVersion) {
        setSelectedLanguageId(String(initialLanguageSelection(user).idiomaId));
        setError(getUserFacingError(changeError));
      }
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
