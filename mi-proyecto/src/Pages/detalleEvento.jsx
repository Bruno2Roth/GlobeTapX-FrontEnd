import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../Styles/eventos.css";
import "../index.css";
import { getEvento } from "../services/evento";
import { getPaises, getAgendaUsuario } from "../config";
import { translateBatch } from "../services/languageService";
import { agregarEventoAAgenda, eliminarEventoDeAgenda } from "../services/evento";

function DetalleEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [evento, setEvento] = useState(null);
  const [paises, setPaises] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enAgenda, setEnAgenda] = useState(false);
  const [agendaId, setAgendaId] = useState(null);
  const [accionMsg, setAccionMsg] = useState("");

  useEffect(() => {
    getPaises()
      .then(setPaises)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id || !userId) return;
    setCargando(true);
    setError("");

    const fetchData = async () => {
      try {
        const e = await getEvento(id);
        const lang = document.documentElement.lang || "es";
        if (lang !== "es") {
          try {
            const textos = [e.nombre, e.descripcion || "", e.categoria || ""].filter(Boolean);
            if (textos.length) {
              const trad = await translateBatch({ texts: textos, targetLanguage: lang, sourceLanguage: "es" });
              if (trad?.data?.translations) {
                let idx = 0;
                e.nombre = trad.data.translations[idx++] || e.nombre;
                e.descripcion = trad.data.translations[idx++] || e.descripcion;
                e.categoria = trad.data.translations[idx++] || e.categoria;
              }
            }
          } catch {}
        }
        setEvento(e);

        const agenda = await getAgendaUsuario(userId);
        const entries = agenda?.agenda || agenda || [];
        const match = entries.find((a) => Number(a.IDEvento) === Number(id));
        if (match) {
          setEnAgenda(true);
          setAgendaId(match.ID);
        }
      } catch (err) {
        setError(err.data?.error || err.message || "Error al cargar evento");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleAgregarAgenda = async () => {
    if (!userId) return;
    try {
      const res = await agregarEventoAAgenda(userId, id);
      setEnAgenda(true);
      setAgendaId(res?.id?.ID || res?.id);
      setAccionMsg("Evento agregado a tu agenda");
      setTimeout(() => setAccionMsg(""), 3000);
    } catch (err) {
      setAccionMsg("Error al agregar a la agenda");
      setTimeout(() => setAccionMsg(""), 3000);
    }
  };

  const handleQuitarAgenda = async () => {
    if (!agendaId) return;
    try {
      await eliminarEventoDeAgenda(agendaId);
      setEnAgenda(false);
      setAgendaId(null);
      setAccionMsg("Evento eliminado de tu agenda");
      setTimeout(() => setAccionMsg(""), 3000);
    } catch (err) {
      setAccionMsg("Error al eliminar de la agenda");
      setTimeout(() => setAccionMsg(""), 3000);
    }
  };

  const handleCompartir = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: evento?.nombre || "Evento", url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setAccionMsg("Enlace copiado al portapapeles");
        setTimeout(() => setAccionMsg(""), 3000);
      } catch {}
    }
  };

  const obtenerNombrePais = (idPais) => {
    const p = paises.find((p) => Number(p.ID) === Number(idPais));
    return p?.nombre || "";
  };

  const formatearFecha = (f) => {
    if (!f) return "";
    return new Date(f).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userId) return null;

  if (cargando) {
    return <div className="detalle-cargando">Cargando evento...</div>;
  }

  if (error) {
    return (
      <div className="detalle-error">
        <p>{error}</p>
        <button onClick={() => navigate("/eventos")}>Volver a eventos</button>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="detalle-error">
        <p>Evento no encontrado</p>
        <button onClick={() => navigate("/eventos")}>Volver a eventos</button>
      </div>
    );
  }

  const tieneCoordenadas = evento.latitud && evento.longitud;

  return (
    <div className="detalle-evento">
      <Link to="/eventos" className="detalle-volver">← Volver a eventos</Link>

      <div className="detalle-hero">
        {evento.imagen ? (
          <img src={evento.imagen} alt={evento.nombre} />
        ) : (
          <div className="detalle-hero-placeholder">📅</div>
        )}
        <div className="detalle-hero-overlay">
          <h1>{evento.nombre}</h1>
          {evento.categoria && <span className="detalle-categoria">{evento.categoria}</span>}
        </div>
      </div>

      {accionMsg && <div className="detalle-accion-msg">{accionMsg}</div>}

      <div className="detalle-body">
        <div className="detalle-info">
          <div className="detalle-info-item">
            <span className="detalle-info-label">📍 Ubicación</span>
            <span className="detalle-info-value">{evento.ubicacion || "No especificada"}</span>
          </div>

          <div className="detalle-info-item">
            <span className="detalle-info-label">🌍 País</span>
            <span className="detalle-info-value">{obtenerNombrePais(evento.IDPais)}</span>
          </div>

          <div className="detalle-info-item">
            <span className="detalle-info-label">📅 Fecha de inicio</span>
            <span className="detalle-info-value">{formatearFecha(evento.fechaInicio)}</span>
          </div>

          {evento.fechaFin && (
            <div className="detalle-info-item">
              <span className="detalle-info-label">📅 Fecha de fin</span>
              <span className="detalle-info-value">{formatearFecha(evento.fechaFin)}</span>
            </div>
          )}

          {evento.categoria && (
            <div className="detalle-info-item">
              <span className="detalle-info-label">🏷️ Categoría</span>
              <span className="detalle-info-value">{evento.categoria}</span>
            </div>
          )}

          {evento.activo !== undefined && (
            <div className="detalle-info-item">
              <span className="detalle-info-label">Estado</span>
              <span className={`detalle-info-value ${evento.activo ? "activo" : "inactivo"}`}>
                {evento.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          )}
        </div>

        {evento.descripcion && (
          <div className="detalle-descripcion">
            <h2>Descripción</h2>
            <p>{evento.descripcion}</p>
          </div>
        )}

        {tieneCoordenadas && (
          <div className="detalle-mapa">
            <h2>Ubicación en el mapa</h2>
            <div className="detalle-mapa-container">
              <iframe
                title="Mapa"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: 12 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${evento.longitud - 0.05},${evento.latitud - 0.05},${evento.longitud + 0.05},${evento.latitud + 0.05}&layer=mapnik&marker=${evento.latitud},${evento.longitud}`}
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="detalle-acciones">
          {enAgenda ? (
            <button className="detalle-btn detalle-btn-quitar" onClick={handleQuitarAgenda}>
              ✓ En tu agenda — Quitar
            </button>
          ) : (
            <button className="detalle-btn detalle-btn-agregar" onClick={handleAgregarAgenda}>
              + Agregar a mi agenda
            </button>
          )}

          <button className="detalle-btn detalle-btn-compartir" onClick={handleCompartir}>
            📤 Compartir
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleEvento;
