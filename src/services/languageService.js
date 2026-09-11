// Compatibilidad de imports históricos: los endpoints viven en backendApi.
export {
  getLanguageCatalog,
  getLanguageTags,
  clearLanguageCatalogCache,
  getSupportedLanguages,
  getPreferredLanguage,
  updatePreferredLanguage,
  translateText,
  translateBatch,
} from "./backendApi";
