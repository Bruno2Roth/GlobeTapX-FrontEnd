import axios from "axios";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

export const API_BASE_URL = "/api";
export const SESSION_EXPIRED_EVENT = "globetapx:session-expired";

const MAX_TOKEN_LENGTH = 5000;
let inMemoryToken = "";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function getStoredToken() {
  if (typeof localStorage === "undefined") return inMemoryToken;
  try {
    inMemoryToken = localStorage.getItem("token") || "";
    return inMemoryToken;
  } catch {
    return inMemoryToken;
  }
}

export function setStoredToken(token) {
  inMemoryToken = typeof token === "string" ? token : "";
  if (typeof localStorage === "undefined") return;
  try {
    if (inMemoryToken) localStorage.setItem("token", inMemoryToken);
    else localStorage.removeItem("token");
  } catch {
    // La sesión en memoria sigue funcionando si el navegador bloquea Storage.
  }
}

export function clearStoredToken() {
  setStoredToken("");
}

function isAuthenticationEndpoint(url = "") {
  const normalizedUrl = String(url).replace(/^\/+/, "");
  return /^auth\/(login|register)(?:[/?]|$)/.test(normalizedUrl);
}

function emitSessionExpired(error) {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, { detail: error }));
}

function createTokenError() {
  const error = new Error(CONNECTION_ERROR_MESSAGE);
  error.status = 431;
  error.code = "TOKEN_TOO_LARGE";
  return error;
}

function normalizeNetworkError(error) {
  if (!error?.response && !error?.status && error?.code !== "ERR_CANCELED") {
    error.isNetworkError = true;
  }
  error.message = CONNECTION_ERROR_MESSAGE;
  return error;
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && token.length > MAX_TOKEN_LENGTH) {
    clearStoredToken();
    const error = createTokenError();
    emitSessionExpired(error);
    return Promise.reject(error);
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data !== undefined && config.data !== null
    && typeof FormData !== "undefined" && !(config.data instanceof FormData)) {
    config.headers = config.headers || {};
    if (!config.headers["Content-Type"]) config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = Number(error?.response?.status || 0);
    if (status) {
      error.status = status;
      error.data = error.response?.data ?? error.data;
    }

    if (status === 401 || status === 431) {
      // A failed login is not an expired authenticated session. Every other
      // 401, and every 431, invalidates the local credential.
      if (status === 431 || !isAuthenticationEndpoint(error.config?.url)) {
        clearStoredToken();
        emitSessionExpired(error);
      }
    }

    return Promise.reject(normalizeNetworkError(error));
  },
);

/**
 * Adaptador para migrar llamadas existentes. Todas las solicitudes pasan por
 * la misma instancia Axios y sus interceptores.
 */
export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    data,
    headers,
    params,
    signal,
    ...rest
  } = options;

  const response = await api.request({
    ...rest,
    url: path,
    method,
    data: body !== undefined ? body : data,
    headers,
    params,
    signal,
  });

  return response.data;
}

export default api;
