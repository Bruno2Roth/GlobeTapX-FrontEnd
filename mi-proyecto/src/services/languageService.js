import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

export const getSupportedLanguages = async () => {
  const response = await api.get("/idioma/supported");
  return unwrap(response);
};

export const getPreferredLanguage = async (usuarioId) => {
  const response = await api.get("/idioma/preferred", {
    params: { usuarioId },
  });
  return unwrap(response);
};

export const updatePreferredLanguage = async (data) => {
  const response = await api.put("/idioma/preferred", data);
  return unwrap(response);
};

export const translateText = async (data) => {
  const response = await api.post("/traduccion", data);
  return response.data;
};

export const translateBatch = async (data) => {
  const response = await api.post("/traduccion/batch", data);
  return response.data;
};
