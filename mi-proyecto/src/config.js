export const HOST = "A-PHZ2-CIDI-18";
export const PORT = 3000;
export const API = `http://${HOST}:${PORT}/api`;
export const login = (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const register = (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const getUsuario = (id) => request(`/usuario/${id}`);
export const updateUsuario = (id, data) => request(`/usuario/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const getPaises = () => request("/pais");
export const getPais = (id) => request(`/pais/${id}`);
export const getAgendaUsuario = (id) => request(`/agendausuario/${id}`);
export const getClima = (country) => request(`/clima/country?country=${encodeURIComponent(country)}`);
export const getIdiomaUsuario = (userId) => request(`/usuario/idioma?usuarioId=${userId}`);
export const updateUsuarioIdioma = (data) => request("/usuario/idioma", { method: "PUT", body: JSON.stringify(data) });
export const getAllData = () => request("/data/all");
export const traducir = (body) => request("/traduccion", { method: "POST", body: JSON.stringify(body) });
export const traducirBatch = (body) => request("/traduccion/batch", { method: "POST", body: JSON.stringify(body) });
const request = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (options.body) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (!res.ok) {
        const err = new Error(`Error ${res.status}`);
        err.status = res.status;
        try { err.data = await res.json(); } catch { }
        throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

