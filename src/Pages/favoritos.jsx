import '../index.css'
import '../Styles/favoritos.css'
import Header from '../Componentes/Header/Header'
import { useState, useEffect } from 'react'

const PAISES = [
  {
    id: 1,
    title: 'Argentina',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 2,
    title: 'Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 3,
    title: 'Brasil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 4,
    title: 'Chile',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 5,
    title: 'China',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 6,
    title: 'Corea del Sur',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 7,
    title: 'España',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 8,
    title: 'Estados Unidos',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 9,
    title: 'Francia',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 10,
    title: 'Inglaterra',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
  {
    id: 11,
    title: 'Israel',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Westernwall2.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original',
    favorited: false,
  },
  {
    id: 12,
    title: 'Italia',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80',
    favorited: false,
  },
]

function Favoritos() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem('favorites') || '[]')

      // Solo conservar países de la lista actual.
      // Los países antiguos, como Islandia y Marruecos, desaparecen.
      return PAISES.map((pais) => {
        const anterior = guardados.find(
          (item) => item.title === pais.title
        )

        return {
          ...pais,
          favorited: anterior ? anterior.favorited : pais.favorited,
        }
      }).sort((a, b) => Number(b.favorited) - Number(a.favorited))
    } catch {
      return PAISES
    }
  })

  const [mostrarTodos, setMostrarTodos] = useState(false)

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id) => {
    setFavorites((actuales) =>
      actuales
        .map((pais) =>
          pais.id === id
            ? { ...pais, favorited: !pais.favorited }
            : pais
        )
        .sort((a, b) => Number(b.favorited) - Number(a.favorited))
    )
  }

  const cantidadFavoritos = favorites.filter(
    (pais) => pais.favorited
  ).length

  const paisesVisibles = mostrarTodos
    ? favorites
    : favorites.filter((pais) => pais.favorited)

  return (
    <div className="favoritos-page">
      <Header />

      <main className="favoritos-contenido">
        <section className="favoritos-hero">
          <div className="favoritos-hero-texto">
            <span className="favoritos-etiqueta">
              ✈ TU PRÓXIMA AVENTURA
            </span>

            <h1>Mis favoritos <span>♥</span></h1>

            <p>
              Guardá los destinos que te inspiran y empezá a planear
              tu próximo viaje.
            </p>

            <div className="favoritos-contador">
              <span className="contador-icono">♥</span>
              <div>
                <strong>{cantidadFavoritos}</strong>
                <small>
                  {cantidadFavoritos === 1
                    ? 'destino guardado'
                    : 'destinos guardados'}
                </small>
              </div>
            </div>
          </div>

          <div className="favoritos-hero-decoracion" aria-hidden="true">
            🌎
          </div>
        </section>

        <section className="favoritos-listado">
          <div className="favoritos-titulo-seccion">
            <div>
              <h2>Mis destinos</h2>
              <p>
                {mostrarTodos
                  ? 'Explorá los destinos disponibles y guardá tus preferidos.'
                  : 'Tus lugares guardados para viajar.'}
              </p>
            </div>

            <button
              className="favoritos-filtro"
              onClick={() => setMostrarTodos(!mostrarTodos)}
            >
              {mostrarTodos ? '♥ Ver favoritos' : '＋ Explorar destinos'}
            </button>
          </div>

          {paisesVisibles.length > 0 ? (
            <div className="favoritos-grid">
              {paisesVisibles.map((pais) => (
                <article className="destino-card" key={pais.id}>
                  <div className="destino-imagen-contenedor">
                    <img
                      className="destino-imagen"
                      src={pais.image}
                      alt={pais.title}
                      loading="lazy"
                    />

                    <span className="destino-etiqueta">
                      {pais.favorited ? '♥ Guardado' : '✈ Destino'}
                    </span>

                    <button
                      className={`destino-corazon ${
                        pais.favorited ? 'activo' : ''
                      }`}
                      onClick={() => toggleFavorite(pais.id)}
                      aria-label={
                        pais.favorited
                          ? `Quitar ${pais.title} de favoritos`
                          : `Agregar ${pais.title} a favoritos`
                      }
                      title={
                        pais.favorited
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'
                      }
                    >
                      {pais.favorited ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="destino-info">
                    <h3>{pais.title}</h3>

                    <div className="destino-pie">
                      <span>
                        {pais.favorited
                          ? 'En tus favoritos'
                          : 'Descubrí este destino'}
                      </span>

                      <span className="destino-flecha">↗</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="favoritos-vacio">
              <div className="favoritos-vacio-icono">♡</div>
              <h3>Todavía no guardaste destinos</h3>
              <p>
                Explorá los países y tocá el corazón para guardar
                los que más te gusten.
              </p>

              <button
                className="favoritos-boton-principal"
                onClick={() => setMostrarTodos(true)}
              >
                Explorar destinos
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Favoritos