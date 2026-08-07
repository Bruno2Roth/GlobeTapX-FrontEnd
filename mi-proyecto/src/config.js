export const API = "/api";
export const login = (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data), noAuth: true });
export const register = (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data), noAuth: true });
export const getUsuario = (id) => request(`/usuario/${id}`);
export const updateUsuario = (id, data) => request(`/usuario/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const getPaises = () => request("/pais");
export const getPais = (id) => request(`/pais/${id}`);
export const getAgendaUsuario = (id) => request(`/agendausuario/${id}`);
export const getClima = (country) => request(`/clima/country?country=${encodeURIComponent(country)}`);
export const getAllData = () => request("/data/all");
export const getFotoPerfil = (userId) => request(`/auth/foto/${userId}`, { noAuth: true });
export const getEventos = () => request("/evento");
export const getEvento = (id) => request(`/evento/${id}`);
export const getEventosPorPais = (idPais) => request(`/evento/pais/${idPais}`);
export const getEventosPorCategoria = (idCategoria) => request(`/evento/categoria/${idCategoria}`);
export const getEventosPorFecha = (desde, hasta) => request(`/evento/fecha?desde=${desde}&hasta=${hasta}`);
export const crearEvento = (data) => request("/evento", { method: "POST", body: JSON.stringify(data) });
export const actualizarEvento = (id, data) => request(`/evento/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const eliminarEvento = (id) => request(`/evento/${id}`, { method: "DELETE" });
export const crearAgendaUsuario = (data) => request("/agendausuario", { method: "POST", body: JSON.stringify(data) });
export const eliminarAgendaUsuario = (id) => request(`/agendausuario/${id}`, { method: "DELETE" });
export const getCategorias = async () => {
  const res = await request("/categoria");
  return res?.data || res || [];
};
export const request = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    if (token && token.length > 5000) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
    }
    const headers = { ...options.headers };
    if (options.body) headers["Content-Type"] = "application/json";
    if (token && !options.noAuth) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, { ...options, headers });
    if (res.status === 431) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
    }
    if (!res.ok) {
        const err = new Error(`Error ${res.status}`);
        err.status = res.status;
        try { err.data = await res.json(); } catch { }
        throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

