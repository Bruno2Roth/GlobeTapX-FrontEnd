// Compatibilidad de imports históricos: los endpoints viven en backendApi.
export {
  getEventos,
  getEvento,
  getEventosPorPais,
  getEventosPorCategoria,
  getEventosPorFecha,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  agregarEventoAAgenda,
  eliminarEventoDeAgenda,
} from "./backendApi";
