import api from "./api";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const LANGUAGE_IDS_BY_CODE = {
  es: 1,
  en: 2,
  fr: 3,
  it: 4,
  pt: 5,
  ko: 6,
  zh: 7,
  he: 8,
};

const unwrap = (response) => {
  const body = response?.data ?? response;
  return body?.data ?? body;
};

const unwrapCatalog = (response) => {
  const body = response?.data ?? response;
  return body?.data ?? body?.idiomas ?? body?.languages ?? body;
};

const unwrapLanguageCatalog = (response) => {
  const body = response?.data ?? response;
  return body?.idioma ?? body?.data?.idioma ?? body?.data ?? body;
};

let languageCatalogCache = null;
let languageCatalogRequest = null;
const languageTagsCache = new Map();
const languageTagsRequests = new Map();
let supportedLanguagesRequest = null;
const preferredLanguageRequests = new Map();

export const getLanguageCatalog = () => {
  if (languageCatalogCache) return Promise.resolve(languageCatalogCache);
  if (!languageCatalogRequest) {
    languageCatalogRequest = api.get("/idioma/catalogo")
      .then(unwrapCatalog)
      .then((catalog) => {
        languageCatalogCache = Array.isArray(catalog) ? catalog : [];
        return languageCatalogCache;
      })
      .finally(() => {
        languageCatalogRequest = null;
      });
  }
  return languageCatalogRequest;
};

export const getLanguageTags = (idiomaId) => {
  const key = String(idiomaId ?? "");
  if (!key) return Promise.reject(new Error(CONNECTION_ERROR_MESSAGE));
  if (languageTagsCache.has(key)) return Promise.resolve(languageTagsCache.get(key));
  if (!languageTagsRequests.has(key)) {
    languageTagsRequests.set(key, api.get(`/idioma/catalogo/${encodeURIComponent(key)}`)
      .then(unwrapLanguageCatalog)
      .then((catalog) => {
        languageTagsCache.set(key, catalog);
        return catalog;
      })
      .finally(() => {
        languageTagsRequests.delete(key);
      }));
  }
  return languageTagsRequests.get(key);
};

export const clearLanguageCatalogCache = () => {
  languageCatalogCache = null;
  languageTagsCache.clear();
};

export const getSupportedLanguages = () => {
  if (!supportedLanguagesRequest) {
    // Alias legado: el catálogo local es ahora la fuente única de idiomas.
    supportedLanguagesRequest = getLanguageCatalog()
      .finally(() => {
        supportedLanguagesRequest = null;
      });
  }
  return supportedLanguagesRequest;
};

export const getPreferredLanguage = (usuarioId) => {
  const key = String(usuarioId);
  if (!preferredLanguageRequests.has(key)) {
    preferredLanguageRequests.set(key, api.get("/usuario/idioma", {
      params: { usuarioId },
    }).then(unwrap).finally(() => {
      preferredLanguageRequests.delete(key);
    }));
  }
  return preferredLanguageRequests.get(key);
};

export const updatePreferredLanguage = async (data) => {
  const rawId = data?.idiomaId;
  const idiomaId = rawId === undefined || rawId === null || rawId === ""
    ? LANGUAGE_IDS_BY_CODE[String(data?.codigoIdioma || "").toLowerCase()]
    : Number(rawId);
  const body = { usuarioId: data?.usuarioId };
  if (Number.isInteger(idiomaId) && idiomaId > 0) body.idiomaId = idiomaId;
  else if (data?.codigoIdioma) body.codigoIdioma = data.codigoIdioma;

  const response = await api.put("/usuario/idioma", body);
  const payload = response.data?.data ?? response.data;
  if (response.data?.success === false || payload?.success === false) {
    const error = new Error(CONNECTION_ERROR_MESSAGE);
    error.status = response.status || 400;
    error.data = response.data;
    throw error;
  }
  return payload;
};

export const translateText = async (data) => {
  const response = await api.post("/traduccion", data);
  return response.data;
};

export const translateBatch = async (data) => {
  const response = await api.post("/traduccion/batch", data);
  return response.data;
};
