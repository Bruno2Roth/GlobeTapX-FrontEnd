import axios from "axios";
import { API } from "../config";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      error.status = error.response.status;
      error.data = error.response.data;
    }
    error.message = CONNECTION_ERROR_MESSAGE;
    return Promise.reject(error);
  },
);

export default api;
