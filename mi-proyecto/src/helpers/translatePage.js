import { CONNECTION_ERROR_MESSAGE } from "./errorMessages";

const DEFAULT_LANGUAGE = "es";
export const SUPPORTED_LANGUAGE_CODES = ["es", "en", "fr", "it", "pt", "ko", "zh", "he"];
export const LANGUAGE_OPTIONS = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "he", name: "עברית" },
];

export function normalizeLanguageCode(language) {
  const raw = String(language || DEFAULT_LANGUAGE).trim().toLowerCase().split("-")[0];
  const normalized = raw === "iw" ? "he" : raw;
  return SUPPORTED_LANGUAGE_CODES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function setPreferredLanguage(language) {
  const normalized = normalizeLanguageCode(language);
  localStorage.setItem("preferredLanguage", normalized);
  document.documentElement.lang = normalized;
  return normalized;
}

export function normalizeSupportedLanguages(response) {
  const payload = response?.data ?? response;
  let list = Array.isArray(payload)
    ? payload
    : payload?.idiomas || payload?.languages || payload?.items || payload?.data || [];

  if (!Array.isArray(list) && list && typeof list === "object") {
    list = Object.entries(list).map(([codigo, value]) => ({ codigo, ...(value || {}) }));
  }

  const seen = new Set();
  return list.map((language) => {
    if (!language) return { code: "", name: "" };
    if (typeof language === "string") {
      const code = normalizeLanguageCode(language);
      return {
        code,
        name: LANGUAGE_OPTIONS.find((item) => item.code === code)?.name,
      };
    }

    const code = normalizeLanguageCode(language.codigo || language.codigoIdioma || language.code);
    return {
      code,
      name: language.nombre || language.name || language.nombreIdioma || LANGUAGE_OPTIONS.find((item) => item.code === code)?.name,
    };
  }).filter((language) => {
    if (!language.name || seen.has(language.code)) return false;
    seen.add(language.code);
    return true;
  });
}

function translatableElements() {
  return [...document.querySelectorAll("[data-translate]")];
}

export async function translatePage(language = DEFAULT_LANGUAGE) {
  const targetLanguage = normalizeLanguageCode(language);
  const elements = translatableElements();

  if (targetLanguage === DEFAULT_LANGUAGE || !elements.length) {
    elements.forEach((element) => { element.textContent = element.dataset.translate; });
    document.documentElement.lang = targetLanguage;
    return targetLanguage;
  }

  const token = localStorage.getItem("token");
  const response = await fetch("/api/traduccion/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({
      texts: elements.map((element) => element.dataset.translate),
      sourceLanguage: DEFAULT_LANGUAGE,
      targetLanguage,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(CONNECTION_ERROR_MESSAGE);

  const translations = payload.data?.translations || payload.data?.translatedTexts || payload.translations || payload.translatedTexts || [];
  elements.forEach((element, index) => {
    if (translations[index]) element.textContent = translations[index];
  });
  document.documentElement.lang = targetLanguage;
  return targetLanguage;
}

