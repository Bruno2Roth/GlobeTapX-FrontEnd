import { request } from "../config";

export const getEventos = async () => {
  const data = await request("/evento");
  return data;
};

export const getEvento = async (id) => {
  const data = await request(`/evento/${id}`);
  return data;
};

export const getEventosPorPais = async (idPais) => {
  const data = await request(`/evento/pais/${idPais}`);
  return data;
};

export const getEventosPorCategoria = async (idCategoria) => {
  const data = await request(`/evento/categoria/${idCategoria}`);
  return data;
};

export const getEventosPorFecha = async (desde, hasta) => {
  const data = await request(`/evento/fecha?desde=${desde}&hasta=${hasta}`);
  return data;
};

export const crearEvento = async (eventoData) => {
  const data = await request("/evento", { method: "POST", body: JSON.stringify(eventoData) });
  return data;
};

export const actualizarEvento = async (id, eventoData) => {
  const data = await request(`/evento/${id}`, { method: "PUT", body: JSON.stringify(eventoData) });
  return data;
};

export const eliminarEvento = async (id) => {
  const data = await request(`/evento/${id}`, { method: "DELETE" });
  return data;
};

export const agregarEventoAAgenda = async (userId, eventId, interes = "quiero ir", recordatorio = null) => {
  const data = await request("/agendausuario", {
    method: "POST",
    body: JSON.stringify({ IDUsuario: userId, IDEvento: eventId, interes, recordatorio }),
  });
  return data;
};

export const eliminarEventoDeAgenda = async (agendaId) => {
  const data = await request(`/agendausuario/${agendaId}`, { method: "DELETE" });
  return data;
};
