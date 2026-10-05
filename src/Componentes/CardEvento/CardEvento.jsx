import { Link } from "react-router-dom";
import "./index.css";

function CardEvento({
  evento,
  nombrePais,
  favoritado = false,
  onToggleFavorito,
  favoritoDeshabilitado = false,
}) {
  if (!evento) return null;

  const fecha = evento.fechaInicio
    ? new Date(evento.fechaInicio).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

  return (
    <article className="cardEvento">
      <Link to={`/evento/${evento.ID ?? evento.id}`} className="cardEvento-enlace">
        <div className="cardEvento-img">
          {evento.imagen ? (
            <img src={evento.imagen} alt={evento.nombre} loading="lazy" />
          ) : (
            <div className="cardEvento-placeholder" aria-hidden="true">📅</div>
          )}
        </div>
        <div className="eventoInfo">
          <h3 className="cardEvento-titulo">{evento.nombre || "Evento"}</h3>
          {(nombrePais || evento.paisNombre) && (
            <p className="cardEvento-pais">{nombrePais || evento.paisNombre}</p>
          )}
          {fecha && <p className="cardEvento-fecha">{fecha}</p>}
          {evento.categoria && (
            <span className="cardEvento-categoria">{evento.categoria}</span>
          )}
          {evento.descripcion && (
            <p className="cardEvento-descripcion">{evento.descripcion}</p>
          )}
          {evento.ubicacion && (
            <p className="cardEvento-ubicacion">📍 {evento.ubicacion}</p>
          )}
        </div>
      </Link>
      {onToggleFavorito && (
        <button
          className="cardEvento-favorito"
          type="button"
          aria-pressed={favoritado}
          aria-label={favoritado ? "Quitar de favoritos" : "Agregar a favoritos"}
          disabled={favoritoDeshabilitado}
          onClick={onToggleFavorito}
        >
          {favoritado ? "♥ Guardado" : "♡ Guardar"}
        </button>
      )}
    </article>
  );
}

export default CardEvento;
