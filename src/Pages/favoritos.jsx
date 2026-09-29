import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { eliminarFavorito, getEvento, getFavoritos } from "../services/backendApi";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import "../index.css";
import "../Componentes/FavoriteCard/index.css";

export default function Favoritos() {
  const { userId } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    getFavoritos(userId)
      .then(async (entries) => {
        const resolved = await Promise.all(entries.map(async (entry) => {
          try {
            const event = await getEvento(entry.IDEvento);
            return { id: entry.ID, event };
          } catch {
            return null; // El evento pudo haber sido eliminado.
          }
        }));
        if (active) setFavorites(resolved.filter(Boolean));
      })
      .catch(() => { if (active) setError(CONNECTION_ERROR_MESSAGE); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  const removeFavorite = async (id) => {
    setRemovingId(id);
    setError("");
    try {
      await eliminarFavorito(id);
      setFavorites((current) => current.filter((favorite) => favorite.id !== id));
    } catch {
      setError(CONNECTION_ERROR_MESSAGE);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="page">
      <h1>Mis eventos favoritos</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Cargando favoritos...</p> : favorites.length === 0 ? (
        <p>Todavía no guardaste eventos favoritos. <Link to="/eventos">Explorar eventos</Link></p>
      ) : (
        <div className="eventos-grid">
          {favorites.map(({ id, event }) => (
            <article className="favoriteCard" key={id}>
              <Link to={`/evento/${event.ID}`}>
                {event.imagen && <img src={event.imagen} alt="" />}
                <h2>{event.nombre}</h2>
              </Link>
              <button type="button" className="favoriteToggle favorited"
                disabled={removingId === id} onClick={() => removeFavorite(id)}
                aria-label={`Quitar ${event.nombre} de favoritos`}>
                ❤️ Quitar de favoritos
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
