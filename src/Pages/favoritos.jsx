import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import "../Styles/favoritos.css";
import CardEvento from "../Componentes/CardEvento/CardEvento";
import {
  agregarEventoFavorito,
  eliminarEventoFavorito,
  getEventoFavoritos,
  getEventos,
  getPaises,
} from "../services/backendApi";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { useSession } from "../context/SessionContext";

function Favoritos() {
  const { user } = useSession();
  const [favoritos, setFavoritos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [pendiente, setPendiente] = useState(null);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const [favoritosBackend, eventosBackend, paisesBackend] = await Promise.all([
        getEventoFavoritos(),
        getEventos(),
        getPaises(),
      ]);
      setFavoritos(favoritosBackend);
      setEventos(eventosBackend);
      setPaises(paisesBackend);
    } catch (requestError) {
      console.error("Error al cargar favoritos:", requestError);
      setError(CONNECTION_ERROR_MESSAGE);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    void cargarDatos();
    return undefined;
  }, [cargarDatos, user]);

  const paisPorId = useMemo(
    () => new Map(paises.map((pais) => [String(pais.ID), pais.nombre])),
    [paises],
  );

  const favoritosPorEvento = useMemo(
    () => new Map(favoritos.map((favorite) => [String(favorite.IDEvento), favorite])),
    [favoritos],
  );

  const destinosGuardados = useMemo(
    () => favoritos.map((favorite) => {
      const evento = favorite.evento
        || eventos.find((item) => String(item.ID ?? item.id) === String(favorite.IDEvento));
      return evento ? { ...evento, favoriteId: favorite.ID ?? favorite.id } : null;
    }).filter(Boolean),
    [eventos, favoritos],
  );

  const toggleFavorito = async (evento) => {
    const eventId = evento.ID ?? evento.id;
    const favorite = favoritosPorEvento.get(String(eventId));
    setPendiente(String(eventId));
    setError("");
    try {
      if (favorite) await eliminarEventoFavorito(favorite.ID ?? favorite.id);
      else await agregarEventoFavorito(eventId);
      setFavoritos(await getEventoFavoritos());
    } catch (requestError) {
      console.error("Error al actualizar favoritos:", requestError);
      setError(CONNECTION_ERROR_MESSAGE);
    } finally {
      setPendiente(null);
    }
  };

  if (!user) return null;

  const contenidoVisible = mostrarTodos ? eventos : destinosGuardados;

  return (
    <div className="favoritos-page">
      <main className="favoritos-contenido">
        <section className="favoritos-hero">
          <div className="favoritos-hero-texto">
            <span className="favoritos-etiqueta">✈ TU PRÓXIMA AVENTURA</span>
            <h1>Mis favoritos <span>♥</span></h1>
            <p>Guardá eventos de viaje para encontrarlos después y planear tu próxima aventura.</p>
            <div className="favoritos-contador">
              <span className="contador-icono">♥</span>
              <div>
                <strong>{destinosGuardados.length}</strong>
                <small>{destinosGuardados.length === 1 ? "evento guardado" : "eventos guardados"}</small>
              </div>
            </div>
          </div>
          <div className="favoritos-hero-decoracion" aria-hidden="true">🌎</div>
        </section>

        <section className="favoritos-listado">
          <div className="favoritos-titulo-seccion">
            <div>
              <h2>{mostrarTodos ? "Eventos disponibles" : "Mis eventos"}</h2>
              <p>{mostrarTodos
                ? "Elegí un evento y guardalo en tu cuenta."
                : "Tus eventos favoritos sincronizados con tu cuenta."}</p>
            </div>
            <button
              className="favoritos-filtro"
              type="button"
              onClick={() => setMostrarTodos((visible) => !visible)}
            >
              {mostrarTodos ? "♥ Ver favoritos" : "＋ Explorar eventos"}
            </button>
          </div>

          {error && <p className="ev-error" role="alert">{error}</p>}
          {cargando ? (
            <p className="favoritos-cargando">Cargando eventos...</p>
          ) : contenidoVisible.length ? (
            <div className="favoritos-grid">
              {contenidoVisible.map((evento) => {
                const id = evento.ID ?? evento.id;
                const favorite = favoritosPorEvento.get(String(id));
                return (
                  <CardEvento
                    key={id}
                    evento={evento}
                    nombrePais={paisPorId.get(String(evento.IDPais)) || evento.paisNombre || ""}
                    favoritado={Boolean(favorite)}
                    favoritoDeshabilitado={pendiente === String(id)}
                    onToggleFavorito={() => toggleFavorito(evento)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="favoritos-vacio">
              <div className="favoritos-vacio-icono">♡</div>
              <h3>{mostrarTodos ? "Todavía no hay eventos disponibles" : "Todavía no guardaste eventos"}</h3>
              <p>{mostrarTodos
                ? "Cuando se publiquen eventos, vas a poder guardarlos acá."
                : "Explorá los eventos y guardá los que te interesen."}</p>
              {!mostrarTodos && (
                <Link className="favoritos-filtro" to="/eventos">Explorar eventos</Link>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Favoritos;
