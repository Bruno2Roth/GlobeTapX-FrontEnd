import { useEffect, useState } from "react";
import { getPreferredLanguage, getSupportedLanguages, updatePreferredLanguage } from "../../services/languageService";
import { initLanguageSelector, normalizeLanguageCode, translatePage } from "../../helpers/translatePage";
import "./index.css";

const FALLBACK_LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
];

function normalizeLanguages(response) {
  const list = Array.isArray(response) ? response : response?.idiomas || response?.languages || response?.items || [];
  return list.map((language) => ({
    code: language.codigo || language.code || language.codigoIdioma,
    name: language.nombre || language.name || language.nombreIdioma,
  })).filter((language) => language.code && language.name);
}

function normalizePreferred(response) {
  if (typeof response === "string") return response;
  return response?.codigoIdioma || response?.codigo || response?.idioma || response?.code || "";
}

export default function LanguageSelector({ className = "" }) {
  const userId = localStorage.getItem("userId");
  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem("preferredLanguage") || document.documentElement.lang || "es",
  );

  useEffect(() => initLanguageSelector("language-selector"), []);

  useEffect(() => {
    getSupportedLanguages().then((response) => {
      const list = normalizeLanguages(response);
      if (list.length) setLanguages(list);
    }).catch(() => {});

    if (userId) {
      getPreferredLanguage(userId).then((response) => {
        const preferred = normalizePreferred(response);
        if (preferred) setSelectedLanguage(normalizeLanguageCode(preferred));
      }).catch(() => {});
    }
  }, [userId]);

  useEffect(() => {
    const normalized = normalizeLanguageCode(selectedLanguage);
    document.documentElement.lang = normalized;
    localStorage.setItem("preferredLanguage", normalized);
    window.dispatchEvent(new CustomEvent("preferredlanguagechange", { detail: selectedLanguage }));
    void translatePage(normalized).catch((error) => console.warn("No se pudo traducir la interfaz:", error));
  }, [selectedLanguage]);

  const handleChange = async (event) => {
    const nextLanguage = event.target.value;
    setSelectedLanguage(nextLanguage);
    if (!userId) return;
    try {
      await updatePreferredLanguage({ usuarioId: Number(userId), codigoIdioma: nextLanguage });
    } catch {
      // La preferencia local sigue disponible si falla el guardado remoto.
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
    </label>
  );
}
