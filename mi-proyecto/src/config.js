export const HOST = "localhost";
export const PORT = 3000;
export const usuarioID = "10"

export const API = `http://${HOST}:${PORT}/api`; //Base para repetir en todo
export const agenda = `http://${HOST}:${PORT}/api/agendausuario/${usuarioID}`;
export const usuarioURL = `${API}/usuario/${usuarioID}`;
export const paisesURL = `${API}/pais`;
export const climaBaseURL = `${API}/clima/country?country=`;
export const TRADUCTOR_URL = "https://api.mymemory.translated.net/get";