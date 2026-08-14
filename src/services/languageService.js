import api from "./api";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const unwrap = (response) => response.data?.data ?? response.data;
let supportedLanguagesRequest = null;
const preferredLanguageRequests = new Map();

export const getSupportedLanguages = () => {
  if (!supportedLanguagesRequest) {
    supportedLanguagesRequest = api.get("/idioma/supported")
      .then(unwrap)
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
  const response = await api.put("/usuario/idioma", data);
  const payload = response.data?.data ?? response.data;
  if (response.status !== 200 || response.data?.success === false || payload?.success === false) {
    throw new Error(CONNECTION_ERROR_MESSAGE);
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
