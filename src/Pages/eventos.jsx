import { useEffect, useState } from "react";
import "../Styles/eventos.css";
import "../index.css";
import {
  agregarEventoFavorito,
  eliminarEventoFavorito,
  getCategorias,
  getEventoFavoritos,
  getEventos,
  getEventosPorCategoria,
  getEventosPorFecha,
  getEventosPorPais,
  getPaises,
  translateBatch,
} from "../services/backendApi";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { useSession } from "../context/SessionContext";
import CardEvento from "../Componentes/CardEvento/CardEvento";

function Eventos() {
  const { user } = useSession();
  const [eventos, setEventos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [favoritoPendiente, setFavoritoPendiente] = useState(null);
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
    if (!user) {
      setFavoritos([]);
      return undefined;
    }
    let active = true;
    getEventoFavoritos()
      .then((data) => { if (active) setFavoritos(data); })
      .catch(() => { if (active) setError(CONNECTION_ERROR_MESSAGE); });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    let active = true;
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
        if (!active) return;

        const lang = document.documentElement.lang || "es";
        if (lang !== "es") {
          try {
            const textos = data.flatMap((evento) => [
              evento.nombre,
              evento.descripcion || "",
              evento.categoria || "",
            ].filter(Boolean));
            if (textos.length) {
              const trad = await translateBatch({
                texts: textos,
                targetLanguage: lang,
                sourceLanguage: "es",
              });
              if (!active) return;
              if (trad?.data?.translations) {
                let idx = 0;
                data = data.map((evento) => ({
                  ...evento,
                  nombre: trad.data.translations[idx++] || evento.nombre,
                  descripcion: trad.data.translations[idx++] || evento.descripcion,
                  categoria: trad.data.translations[idx++] || evento.categoria,
                }));
              }
            }
          } catch {}
        }

        if (!active) return;
        data.sort((a, b) => ordenFecha === "asc"
          ? new Date(a.fechaInicio) - new Date(b.fechaInicio)
          : new Date(b.fechaInicio) - new Date(a.fechaInicio));
        setEventos(data);
      } catch (requestError) {
        if (active) {
          console.error("Error al cargar eventos:", requestError);
          setError(CONNECTION_ERROR_MESSAGE);
        }
      } finally {
        if (active) setCargando(false);
      }
    };

    void fetchEventos();
    return () => { active = false; };
  }, [categoriaFiltro, fechaDesde, fechaHasta, ordenFecha, paisFiltro, user]);

  const eventosFiltrados = eventos.filter((evento) => {
    if (!busqueda) return true;
    const term = busqueda.toLowerCase();
    return (
      (evento.nombre || "").toLowerCase().includes(term) ||
      (evento.descripcion || "").toLowerCase().includes(term) ||
      (evento.ubicacion || "").toLowerCase().includes(term)
    );
  });

  const obtenerNombrePais = (idPais) => {
    const pais = paises.find((item) => Number(item.ID) === Number(idPais));
    return pais?.nombre || "";
  };

  const toggleFavorito = async (evento) => {
    const eventId = Number(evento.ID ?? evento.id);
    const favorito = favoritos.find((item) => Number(item.IDEvento) === eventId);
    setFavoritoPendiente(eventId);
    setError("");
    try {
      if (favorito) {
        await eliminarEventoFavorito(favorito.ID ?? favorito.id);
      } else {
        await agregarEventoFavorito(eventId);
      }
      setFavoritos(await getEventoFavoritos());
    } catch (requestError) {
      console.error("Error al actualizar favoritos:", requestError);
      setError(CONNECTION_ERROR_MESSAGE);
    } finally {
      setFavoritoPendiente(null);
    }
  };

  if (!user) return null;

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
          onChange={(event) => setBusqueda(event.target.value)}
        />

        <select
          className="ev-filtro-select"
          value={paisFiltro}
          onChange={(event) => {
            setPaisFiltro(event.target.value);
            setCategoriaFiltro("");
            setFechaDesde("");
            setFechaHasta("");
          }}
        >
          <option value="">Todos los países</option>
          {paises.map((pais) => (
            <option key={pais.ID} value={pais.ID}>{pais.nombre}</option>
          ))}
        </select>

        <select
          className="ev-filtro-select"
          value={categoriaFiltro}
          onChange={(event) => {
            setCategoriaFiltro(event.target.value);
            setPaisFiltro("");
            setFechaDesde("");
            setFechaHasta("");
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.ID} value={categoria.ID}>{categoria.nombre}</option>
          ))}
        </select>

        <div className="ev-filtro-fechas">
          <input
            type="date"
            className="ev-filtro-date"
            value={fechaDesde}
            onChange={(event) => {
              setFechaDesde(event.target.value);
              setPaisFiltro("");
              setCategoriaFiltro("");
            }}
            placeholder="Desde"
          />
          <input
            type="date"
            className="ev-filtro-date"
            value={fechaHasta}
            onChange={(event) => {
              setFechaHasta(event.target.value);
              setPaisFiltro("");
              setCategoriaFiltro("");
            }}
            placeholder="Hasta"
          />
        </div>

        <button
          className="ev-filtro-orden"
          type="button"
          onClick={() => setOrdenFecha(ordenFecha === "asc" ? "desc" : "asc")}
        >
          {ordenFecha === "asc" ? "↑ Más antiguos" : "↓ Más recientes"}
        </button>
      </div>

      {error && <p className="ev-error" role="alert">{error}</p>}

      {cargando ? (
        <div className="ev-cargando">Cargando eventos...</div>
      ) : eventosFiltrados.length === 0 ? (
        <div className="ev-vacio"><p>No se encontraron eventos</p></div>
      ) : (
        <div className="eventos-grid">
          {eventosFiltrados.map((evento) => {
            const favorito = favoritos.find(
              (item) => Number(item.IDEvento) === Number(evento.ID ?? evento.id),
            );
            return (
              <CardEvento
                key={evento.ID ?? evento.id}
                evento={evento}
                nombrePais={obtenerNombrePais(evento.IDPais)}
                favoritado={Boolean(favorito)}
                favoritoDeshabilitado={favoritoPendiente === Number(evento.ID ?? evento.id)}
                onToggleFavorito={() => toggleFavorito(evento)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Eventos;
