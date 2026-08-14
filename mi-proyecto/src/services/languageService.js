import api from "./api";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const unwrap = (response) => response.data?.data ?? response.data;

export const getSupportedLanguages = async () => {
  const response = await api.get("/idioma/supported");
  return unwrap(response);
};

export const getPreferredLanguage = async (usuarioId) => {
  const response = await api.get("/usuario/idioma", {
    params: { usuarioId },
  });
  return unwrap(response);
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
