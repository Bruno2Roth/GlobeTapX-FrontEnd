import { Link } from "react-router-dom";
import "./index.css";

function CardEvento({ evento, nombrePais }) {
  if (!evento) return null;

  const formatearFecha = (f) => {
    if (!f) return "";
    return new Date(f).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/evento/${evento.ID}`} className="cardEvento">
      <div className="cardEvento-img">
        {evento.imagen ? (
          <img src={evento.imagen} alt={evento.nombre} />
        ) : (
          <div className="cardEvento-placeholder">📅</div>
        )}
      </div>
      <div className="eventoInfo">
        <h3 className="cardEvento-titulo">{evento.nombre}</h3>
        {nombrePais && <p className="cardEvento-pais">{nombrePais}</p>}
        <p className="cardEvento-fecha">{formatearFecha(evento.fechaInicio)}</p>
        {evento.categoria && (
          <span className="cardEvento-categoria">{evento.categoria}</span>
        )}
      </div>
    </Link>
  );
}

export default CardEvento;
