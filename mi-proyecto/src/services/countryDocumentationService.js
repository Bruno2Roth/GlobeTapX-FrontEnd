import api from "./api";

export const getCountryDocumentation = async (paisId, options = {}) => {
  const response = await api.get("/paisInfo/documentacion", {
    ...options,
    params: { ...(options.params || {}), paisId },
  });
  return response.data?.data ?? response.data;
};

export const getCountryDocumentationByName = async (nombre, options = {}) => {
  const response = await api.get("/paisInfo/documentacion", {
    ...options,
    params: { nombre },
  });
  return response.data?.data ?? response.data;
};
