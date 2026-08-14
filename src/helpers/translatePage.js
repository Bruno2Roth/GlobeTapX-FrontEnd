import { getLanguageTags, translateBatch } from "../services/languageService";
import { CONNECTION_ERROR_MESSAGE } from "./errorMessages";

const DEFAULT_LANGUAGE = "es";
const DEFAULT_LANGUAGE_ID = 1;

const LANGUAGE_DEFINITIONS = [
  { idiomaId: 1, code: "es", name: "Español", nativeName: "Español" },
  { idiomaId: 2, code: "en", name: "English", nativeName: "English" },
  { idiomaId: 3, code: "fr", name: "Français", nativeName: "Français" },
  { idiomaId: 4, code: "it", name: "Italiano", nativeName: "Italiano" },
  { idiomaId: 5, code: "pt", name: "Português", nativeName: "Português" },
  { idiomaId: 6, code: "ko", name: "한국어", nativeName: "한국어" },
  { idiomaId: 7, code: "zh", name: "中文", nativeName: "中文" },
  { idiomaId: 8, code: "he", name: "עברית", nativeName: "עברית" },
];

export const SUPPORTED_LANGUAGE_CODES = LANGUAGE_DEFINITIONS.map(({ code }) => code);
export const LANGUAGE_OPTIONS = LANGUAGE_DEFINITIONS.map((language) => ({
  ...language,
  id: language.idiomaId,
}));

const LANGUAGE_BY_CODE = new Map(LANGUAGE_OPTIONS.map((language) => [language.code, language]));
const LANGUAGE_BY_ID = new Map(LANGUAGE_OPTIONS.map((language) => [language.idiomaId, language]));

function unwrapResponse(response) {
  let payload = response?.data ?? response;
  if (payload?.data && !Array.isArray(payload.data)) payload = payload.data;
  return payload;
}

export function normalizeLanguageCode(language) {
  if (typeof language === "number" || /^\d+$/.test(String(language || ""))) {
    return getLanguageCodeForId(language);
  }

  const raw = String(language || DEFAULT_LANGUAGE).trim().toLowerCase().split("-")[0];
  const normalized = raw === "iw" ? "he" : raw;
  return SUPPORTED_LANGUAGE_CODES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function getLanguageIdForCode(code, catalog = []) {
  const normalizedCode = normalizeLanguageCode(code);
  const fromCatalog = normalizeLanguageCatalog(catalog).find((language) => language.code === normalizedCode);
  return fromCatalog?.idiomaId || LANGUAGE_BY_CODE.get(normalizedCode)?.idiomaId || DEFAULT_LANGUAGE_ID;
}

export function getLanguageCodeForId(id, catalog = []) {
  const numericId = Number(id);
  const fromCatalog = normalizeLanguageCatalog(catalog).find((language) => language.idiomaId === numericId);
  return fromCatalog?.code || LANGUAGE_BY_ID.get(numericId)?.code || DEFAULT_LANGUAGE;
}

export function normalizeLanguageCatalog(response) {
  const payload = response?.data ?? response;
  let list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.idiomas || payload?.languages || payload?.items || [];

  if (!Array.isArray(list) && list && typeof list === "object") {
    list = Object.entries(list).map(([codigoIdioma, value]) => ({ codigoIdioma, ...(value || {}) }));
  }

  const seen = new Set();
  return list.map((language) => {
    if (!language) return null;
    if (typeof language === "string") {
      const code = normalizeLanguageCode(language);
      const fallback = LANGUAGE_BY_CODE.get(code);
      return fallback ? { ...fallback, id: fallback.idiomaId } : null;
    }

    const rawId = language.idiomaId ?? language.id ?? language.languageId;
    const rawCode = language.codigoIdioma || language.codigo || language.code;
    const code = normalizeLanguageCode(rawCode || getLanguageCodeForId(rawId));
    const parsedId = Number(rawId);
    const idiomaId = Number.isInteger(parsedId) && parsedId > 0
      ? parsedId
      : LANGUAGE_BY_CODE.get(code)?.idiomaId;
    const fallback = LANGUAGE_BY_CODE.get(code);
    if (!Number.isInteger(idiomaId) || idiomaId < 1) return null;

    return {
      ...language,
      id: idiomaId,
      idiomaId,
      code,
      name: language.nombre || language.name || language.nombreIdioma || fallback?.name || code,
      nativeName: language.nombreNativo || language.nativeName || fallback?.nativeName || language.nombre || code,
    };
  }).filter((language) => {
    if (!language || seen.has(language.idiomaId)) return false;
    seen.add(language.idiomaId);
    return true;
  });
}

// Compatibilidad con los consumidores que todavía llaman a este normalizador.
export function normalizeSupportedLanguages(response) {
  return normalizeLanguageCatalog(response);
}

export function resolveLanguageSelection(value, catalog = []) {
  const payload = unwrapResponse(value);
  const preferred = payload?.idiomaPreferido ?? payload?.preferredLanguage ?? payload;
  const candidate = preferred && typeof preferred === "object" ? preferred : { codigoIdioma: preferred };
  const catalogLanguages = normalizeLanguageCatalog(catalog);
  const rawId = candidate?.idiomaId ?? candidate?.languageId ?? candidate?.id;
  const numericId = Number(rawId);
  const validId = Number.isInteger(numericId) && numericId > 0 ? numericId : null;
  const rawCode = candidate?.codigoIdioma || candidate?.codigo || candidate?.code || candidate?.idioma;
  const code = rawCode ? normalizeLanguageCode(rawCode) : getLanguageCodeForId(validId, catalogLanguages);
  const idiomaId = validId || getLanguageIdForCode(code, catalogLanguages);

  return {
    idiomaId,
    id: idiomaId,
    codigoIdioma: getLanguageCodeForId(idiomaId, catalogLanguages) || code,
    code: getLanguageCodeForId(idiomaId, catalogLanguages) || code,
  };
}

export function setPreferredLanguage(language, idiomaId) {
  const selection = resolveLanguageSelection(
    idiomaId === undefined ? language : { codigoIdioma: language, idiomaId },
  );
  localStorage.setItem("preferredLanguage", selection.codigoIdioma);
  localStorage.setItem("preferredLanguageId", String(selection.idiomaId));
  document.documentElement.lang = selection.codigoIdioma;
  return selection.codigoIdioma;
}

function rememberDefaultValue(element) {
  if (element.dataset.translateDefault === undefined) {
    element.dataset.translateDefault = "placeholder" in element
      ? element.placeholder || ""
      : element.textContent || "";
  }
  return element.dataset.translateDefault;
}

function setElementValue(element, value) {
  if ("placeholder" in element) element.placeholder = value;
  else element.textContent = value;
}

function restoreElement(element) {
  setElementValue(element, rememberDefaultValue(element));
}

function localizableElements() {
  return [...document.querySelectorAll("[data-translate-id]")];
}

function legacyElements() {
  return [...document.querySelectorAll("[data-translate]")]
    .filter((element) => !element.hasAttribute("data-translate-id"));
}

function tagsToMap(response) {
  const payload = response?.idioma || response?.data?.idioma || response?.data || response;
  const tags = Array.isArray(payload) ? payload : payload?.tags || [];
  return Object.fromEntries(tags.map((tag) => {
    const tagId = Number(tag?.tagId ?? tag?.id);
    return [tagId, tag?.valor];
  }).filter(([tagId, value]) => Number.isInteger(tagId) && tagId > 0 && value));
}

const translationRequests = new Map();

export async function translatePage(language = DEFAULT_LANGUAGE) {
  const selection = resolveLanguageSelection(language);
  const idElements = localizableElements();
  const oldElements = legacyElements();
  idElements.forEach(rememberDefaultValue);
  oldElements.forEach(rememberDefaultValue);

  let tags = {};
  if (idElements.length) {
    try {
      tags = tagsToMap(await getLanguageTags(selection.idiomaId));
    } catch {
      // Los elementos conservan su texto original si el catálogo no está disponible.
    }
  }

  idElements.forEach((element) => {
    const tagId = Number(element.dataset.translateId);
    const value = tags[tagId];
    if (value) setElementValue(element, value);
    else restoreElement(element);
  });

  if (!oldElements.length || selection.idiomaId === DEFAULT_LANGUAGE_ID) {
    oldElements.forEach(restoreElement);
    document.documentElement.lang = selection.codigoIdioma;
    return selection.codigoIdioma;
  }

  const texts = oldElements.map((element) => element.dataset.translate || rememberDefaultValue(element));
  const requestKey = `${selection.codigoIdioma}:${texts.join("\u0000")}`;
  if (translationRequests.has(requestKey)) return translationRequests.get(requestKey);

  const request = translateBatch({
    texts,
    sourceLanguage: DEFAULT_LANGUAGE,
    targetLanguage: selection.codigoIdioma,
  }).then((payload) => {
    if (payload?.success === false) throw new Error(CONNECTION_ERROR_MESSAGE);

    const translations = payload.data?.translations || payload.data?.translatedTexts || payload.translations || payload.translatedTexts || [];
    oldElements.forEach((element, index) => {
      if (translations[index]) setElementValue(element, translations[index]);
    });
    document.documentElement.lang = selection.codigoIdioma;
    return selection.codigoIdioma;
  }).finally(() => {
    translationRequests.delete(requestKey);
  });

  translationRequests.set(requestKey, request);
  return request;
}
