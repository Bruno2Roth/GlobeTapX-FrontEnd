import { getStoredToken, request } from "./api";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const COUNTRY_CACHE_TTL = 5 * 60 * 1000;
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

const COLLECTION_KEYS = ["eventos", "events", "items", "results"];
// Los campos de identidad, permisos, idioma y foto tienen endpoints propios
// o se resuelven desde el JWT; nunca se envían como parte de un update general.
const NON_AUTHORITATIVE_USER_FIELDS = new Set([
  "id",
  "ID",
  "userId",
  "usuarioId",
  "IDUsuario",
  "isAdmin",
  "IsAdmin",
  "esPremium",
  "role",
  "roles",
  "permissions",
  "permisos",
  "idiomaPreferido",
  "idiomaId",
  "codigoIdioma",
  "language",
  "idioma",
  "fotoPerfil",
  "foto",
  "photo",
  "image",
  "profileImage",
]);

let currentUserRequest = null;
let currentUserRequestToken = "";
let countriesRequest = null;
let countriesCache = null;
let countriesCachedAt = 0;
let languageCatalogCache = null;
let languageCatalogRequest = null;
const languageTagsCache = new Map();
const languageTagsRequests = new Map();
const photoRequests = new Map();

function unwrapData(response) {
  if (!response || typeof response !== "object") return response;
  if (Object.prototype.hasOwnProperty.call(response, "data")) return response.data;
  return response;
}

function unwrapCollection(response, keys = []) {
  const payload = unwrapData(response);
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function normalizeLanguageCatalog(response) {
  const payload = unwrapData(response);
  if (Array.isArray(payload)) return payload;
  return payload?.idiomas || payload?.languages || payload?.items || [];
}

function normalizePreferredLanguagePayload(response) {
  const payload = unwrapData(response);
  return payload?.data ?? payload;
}

function normalizeAgendaResponse(response) {
  const payload = unwrapData(response);
  if (Array.isArray(payload)) return { agenda: payload, feriados: {} };
  if (!payload || typeof payload !== "object") return { agenda: [], feriados: {} };

  return {
    ...payload,
    agenda: Array.isArray(payload.agenda) ? payload.agenda : [],
    feriados: payload.feriados && typeof payload.feriados === "object" ? payload.feriados : {},
  };
}

function invalidIdError(label) {
  const error = new Error(`${label} inválido`);
  error.status = 400;
  return error;
}

function requiredId(id, label) {
  if (id === undefined || id === null || id === "") throw invalidIdError(label);
  return encodeURIComponent(String(id));
}

function sanitizeUserUpdate(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !NON_AUTHORITATIVE_USER_FIELDS.has(key)),
  );
}

function getEventCollection(path, params) {
  return request(path, params ? { params } : {}).then((response) => (
    unwrapCollection(response, COLLECTION_KEYS)
  ));
}

export const login = (credentials) => request("/auth/login", {
  method: "POST",
  body: credentials,
});

export const register = (data) => request("/auth/register", {
  method: "POST",
  body: data,
});

export function getCurrentUser() {
  const token = getStoredToken();
  if (!currentUserRequest || currentUserRequestToken !== token) {
    currentUserRequestToken = token;
    currentUserRequest = request("/auth/me").finally(() => {
      if (currentUserRequestToken === token) {
        currentUserRequest = null;
        currentUserRequestToken = "";
      }
    });
  }
  return currentUserRequest;
}

// Solo se usa para lecturas explícitas permitidas por el backend, como una
// consulta administrativa. La sesión siempre usa /auth/me.
export const getUsuario = (id) => request(`/usuario/${requiredId(id, "Usuario")}`);

// El backend actual todavía requiere el ID en la ruta para actualizar el
// perfil. El contexto obtiene ese ID de /auth/me y el servidor valida que
// coincida con el JWT (o que la cuenta tenga permisos administrativos).
export const updateCurrentUser = (userId, data) => request(`/usuario/${requiredId(userId, "Usuario")}`, {
  method: "PUT",
  body: sanitizeUserUpdate(data),
});

// La ruta moderna de Storage también requiere el ID en la URL y verifica la
// propiedad contra el JWT antes de aceptar el multipart.
export const uploadCurrentUserPhoto = (userId, file) => {
  const formData = new FormData();
  formData.append("fotoPerfil", file);
  return request(`/storage/profile/${requiredId(userId, "Usuario")}`, {
    method: "PUT",
    body: formData,
  });
};

export function getCurrentUserPhoto(userId) {
  const key = requiredId(userId, "Usuario");
  if (!photoRequests.has(key)) {
    photoRequests.set(key, request(`/storage/profile/${key}`).finally(() => {
      photoRequests.delete(key);
    }));
  }
  return photoRequests.get(key);
}

export function getPaises() {
  if (countriesCache && Date.now() - countriesCachedAt < COUNTRY_CACHE_TTL) {
    return Promise.resolve(countriesCache);
  }
  if (!countriesRequest) {
    countriesRequest = request("/pais")
      .then((response) => {
        countriesCache = unwrapCollection(response, ["countries", "paises", "items", "results"]);
        countriesCachedAt = Date.now();
        return countriesCache;
      })
      .finally(() => {
        countriesRequest = null;
      });
  }
  return countriesRequest;
}

export const getPais = (id) => request(`/pais/${requiredId(id, "País")}`).then(unwrapData);

// GET /agendausuario resuelve la cuenta desde el JWT. Ninguna pantalla puede
// seleccionar otra cuenta para esta lectura.
export function getAgendaUsuario() {
  return request("/agendausuario").then(normalizeAgendaResponse);
}

// Solo consumidores administrativos explícitos pueden usar la ruta histórica
// /:id; el backend sigue verificando self-or-admin contra el JWT.
export const getAgendaUsuarioById = (userId) => request(`/agendausuario/${requiredId(userId, "Usuario")}`)
  .then(normalizeAgendaResponse);

export const getClima = (country) => request("/clima/country", {
  params: { country },
}).then(unwrapData);

export const getAllData = () => request("/data/all").then(unwrapData);

export function getEventos() {
  return getEventCollection("/evento");
}

export function getEvento(id) {
  return request(`/evento/${requiredId(id, "Evento")}`).then(unwrapData);
}

export function getEventosPorPais(idPais) {
  return getEventCollection(`/evento/pais/${requiredId(idPais, "País")}`);
}

export function getEventosPorCategoria(idCategoria) {
  return getEventCollection(`/evento/categoria/${requiredId(idCategoria, "Categoría")}`);
}

export function getEventosPorFecha(desde, hasta) {
  return getEventCollection("/evento/fecha", { desde, hasta });
}

export const crearEvento = (data) => request("/evento", { method: "POST", body: data });
export const actualizarEvento = (id, data) => request(`/evento/${requiredId(id, "Evento")}`, { method: "PUT", body: data });
export const eliminarEvento = (id) => request(`/evento/${requiredId(id, "Evento")}`, { method: "DELETE" });

// La identidad del dueño se resuelve exclusivamente desde el JWT en el
// backend; por eso el body no contiene IDUsuario ni usuarioId.
export const agregarEventoAAgenda = (eventId, interes = "quiero ir", recordatorio = null) => request("/agendausuario", {
  method: "POST",
  body: { IDEvento: eventId, interes, recordatorio },
});

export const eliminarEventoDeAgenda = (agendaId) => request(`/agendausuario/${requiredId(agendaId, "Agenda")}`, {
  method: "DELETE",
});

export function getCategorias() {
  return request("/categoria").then((response) => unwrapCollection(response, [
    "categorias",
    "categories",
    "items",
    "results",
  ]));
}

export function getLanguageCatalog() {
  if (languageCatalogCache) return Promise.resolve(languageCatalogCache);
  if (!languageCatalogRequest) {
    languageCatalogRequest = request("/idioma/catalogo")
      .then(normalizeLanguageCatalog)
      .then((catalog) => {
        languageCatalogCache = Array.isArray(catalog) ? catalog : [];
        return languageCatalogCache;
      })
      .finally(() => {
        languageCatalogRequest = null;
      });
  }
  return languageCatalogRequest;
}

export function getLanguageTags(idiomaId) {
  const key = requiredId(idiomaId, "Idioma");
  if (!languageTagsCache.has(key)) {
    if (!languageTagsRequests.has(key)) {
      languageTagsRequests.set(key, request(`/idioma/catalogo/${key}`)
        .then((response) => {
          const payload = unwrapData(response);
          return payload?.idioma ?? payload?.tags ?? payload?.data ?? payload;
        })
        .then((catalog) => {
          languageTagsCache.set(key, catalog);
          return catalog;
        })
        .finally(() => languageTagsRequests.delete(key)));
    }
    return languageTagsRequests.get(key);
  }
  return Promise.resolve(languageTagsCache.get(key));
}

export function clearLanguageCatalogCache() {
  languageCatalogCache = null;
  languageTagsCache.clear();
}

export const getSupportedLanguages = getLanguageCatalog;

// La identidad se resuelve en el servidor desde el Bearer token; no se
// aceptan usuarioId/IDUsuario desde las pantallas.
export function getPreferredLanguage() {
  return request("/usuario/idioma").then(normalizePreferredLanguagePayload);
}

export async function updatePreferredLanguage(data = {}) {
  const rawId = data.idiomaId;
  const codigoIdioma = String(data.codigoIdioma || "").toLowerCase();
  const idiomaId = rawId === undefined || rawId === null || rawId === ""
    ? LANGUAGE_IDS_BY_CODE[codigoIdioma]
    : Number(rawId);
  const body = {};

  if (Number.isInteger(idiomaId) && idiomaId > 0) body.idiomaId = idiomaId;
  else if (codigoIdioma) body.codigoIdioma = codigoIdioma;
  else throw invalidIdError("Idioma");

  const response = await request("/usuario/idioma", { method: "PUT", body });
  const payload = normalizePreferredLanguagePayload(response);
  if (response?.success === false || payload?.success === false) {
    const error = new Error(CONNECTION_ERROR_MESSAGE);
    error.status = 400;
    error.data = response;
    throw error;
  }
  return payload;
}

export const translateText = (data) => request("/traduccion", { method: "POST", body: data });
export const translateBatch = (data) => request("/traduccion/batch", { method: "POST", body: data });

export const getCountryDocumentation = (paisId, options = {}) => request("/paisInfo/documentacion", {
  ...options,
  params: { ...(options.params || {}), paisId },
}).then(unwrapData);

export const getCountryDocumentationByName = (nombre, options = {}) => request("/paisInfo/documentacion", {
  ...options,
  params: { ...(options.params || {}), nombre },
}).then(unwrapData);
