import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/eventos.css";
import "../index.css";
import { getEventos, getEventosPorPais, getEventosPorCategoria, getEventosPorFecha } from "../services/evento";
import { getPaises, getCategorias } from "../config";
import { translateBatch } from "../services/languageService";

function Eventos() {
  const userId = localStorage.getItem("userId");
  const [eventos, setEventos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [paisFiltro, setPaisFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("asc");

  useEffect(() => {
    getPaises().then(setPaises).catch(() => {});
    getCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) return;
    setCargando(true);
    setError("");

    const fetchEventos = async () => {
      try {
        let data;

        if (paisFiltro) {
          data = await getEventosPorPais(paisFiltro);
        } else if (categoriaFiltro) {
          data = await getEventosPorCategoria(categoriaFiltro);
        } else if (fechaDesde && fechaHasta) {
          data = await getEventosPorFecha(fechaDesde, fechaHasta);
        } else {
          data = await getEventos();
        }

        const lang = document.documentElement.lang || "es";
        if (lang !== "es") {
          try {
            const textos = data.flatMap((e) => [e.nombre, e.descripcion || "", e.categoria || ""].filter(Boolean));
            if (textos.length) {
              const trad = await translateBatch({ texts: textos, targetLanguage: lang, sourceLanguage: "es" });
              if (trad?.data?.translations) {
                let idx = 0;
                data = data.map((e) => ({
                  ...e,
                  nombre: trad.data.translations[idx++] || e.nombre,
                  descripcion: trad.data.translations[idx++] || e.descripcion,
                  categoria: trad.data.translations[idx++] || e.categoria,
                }));
              }
            }
          } catch {}
        }

        if (ordenFecha === "asc") {
          data.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
        } else {
          data.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
        }

        setEventos(data);
      } catch (err) {
        setError(err.data?.error || err.message || "Error al cargar eventos");
      } finally {
        setCargando(false);
      }
    };

    fetchEventos();
  }, [userId, paisFiltro, categoriaFiltro, fechaDesde, fechaHasta, ordenFecha]);

  const eventosFiltrados = eventos.filter((e) => {
    if (!busqueda) return true;
    const term = busqueda.toLowerCase();
    return (
      (e.nombre || "").toLowerCase().includes(term) ||
      (e.descripcion || "").toLowerCase().includes(term) ||
      (e.ubicacion || "").toLowerCase().includes(term)
    );
  });

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
    });
  };

  if (!userId) return null;

  return (
    <div className="eventos-page">
      <div className="eventos-header">
        <h1>Eventos</h1>
        <p>Descubrí eventos culturales, festivales y actividades</p>
      </div>

      <div className="eventos-filtros">
        <input
          type="text"
          className="ev-filtro-input"
          placeholder="Buscar eventos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="ev-filtro-select"
          value={paisFiltro}
          onChange={(e) => { setPaisFiltro(e.target.value); setCategoriaFiltro(""); setFechaDesde(""); setFechaHasta(""); }}
        >
          <option value="">Todos los países</option>
          {paises.map((p) => (
            <option key={p.ID} value={p.ID}>{p.nombre}</option>
          ))}
        </select>

        <select
          className="ev-filtro-select"
          value={categoriaFiltro}
          onChange={(e) => { setCategoriaFiltro(e.target.value); setPaisFiltro(""); setFechaDesde(""); setFechaHasta(""); }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.ID} value={c.ID}>{c.nombre}</option>
          ))}
        </select>

        <div className="ev-filtro-fechas">
          <input
            type="date"
            className="ev-filtro-date"
            value={fechaDesde}
            onChange={(e) => { setFechaDesde(e.target.value); setPaisFiltro(""); setCategoriaFiltro(""); }}
            placeholder="Desde"
          />
          <input
            type="date"
            className="ev-filtro-date"
            value={fechaHasta}
            onChange={(e) => { setFechaHasta(e.target.value); setPaisFiltro(""); setCategoriaFiltro(""); }}
            placeholder="Hasta"
          />
        </div>

        <button
          className="ev-filtro-orden"
          onClick={() => setOrdenFecha(ordenFecha === "asc" ? "desc" : "asc")}
        >
          {ordenFecha === "asc" ? "↑ Más antiguos" : "↓ Más recientes"}
        </button>
      </div>

      {error && <p className="ev-error">{error}</p>}

      {cargando ? (
        <div className="ev-cargando">Cargando eventos...</div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="ev-vacio">
          <p>No se encontraron eventos</p>
        </div>
      ) : (
        <div className="eventos-grid">
          {eventosFiltrados.map((e) => (
            <Link to={`/evento/${e.ID}`} key={e.ID} className="ev-card">
              <div className="ev-card-img">
                {e.imagen ? (
                  <img src={e.imagen} alt={e.nombre} />
                ) : (
                  <div className="ev-card-img-placeholder">📅</div>
                )}
              </div>
              <div className="ev-card-body">
                <h3 className="ev-card-titulo">{e.nombre}</h3>
                <p className="ev-card-pais">{obtenerNombrePais(e.IDPais)}</p>
                <div className="ev-card-meta">
                  <span className="ev-card-fecha">{formatearFecha(e.fechaInicio)}</span>
                  {e.categoria && <span className="ev-card-categoria">{e.categoria}</span>}
                </div>
                {e.descripcion && (
                  <p className="ev-card-desc">
                    {e.descripcion.length > 100
                      ? e.descripcion.slice(0, 100) + "..."
                      : e.descripcion}
                  </p>
                )}
                {e.ubicacion && (
                  <p className="ev-card-ubicacion">📍 {e.ubicacion}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Eventos;
