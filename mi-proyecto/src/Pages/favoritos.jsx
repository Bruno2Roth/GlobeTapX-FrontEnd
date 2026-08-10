import '../index.css'
import Header from '../Componentes/Header/Header'
import FavoriteCard from '../Componentes/FavoriteCard/FavoriteCard'
import { useState, useEffect } from 'react'

function Favoritos() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('favorites')
      if (raw) return JSON.parse(raw)
    } catch (e) {
      // ignore parse errors and fall back to defaults
    }

    return [
      { id: 1, title: 'Islandia', image: 'https://source.unsplash.com/featured/?iceland', favorited: true },
      { id: 2, title: 'Marruecos', image: 'https://source.unsplash.com/featured/?morocco', favorited: false },
      { id: 3, title: 'España', image: 'https://source.unsplash.com/featured/?spain', favorited: true },
      { id: 4, title: 'Francia', image: 'https://source.unsplash.com/featured/?france', favorited: false },
      { id: 5, title: 'Italia', image: 'https://source.unsplash.com/featured/?italy', favorited: false },
      { id: 6, title: 'Japón', image: 'https://source.unsplash.com/featured/?japan', favorited: false },
      { id: 7, title: 'Canadá', image: 'https://source.unsplash.com/featured/?canada', favorited: false },
      { id: 8, title: 'Estados Unidos', image: 'https://source.unsplash.com/featured/?usa', favorited: false },
      { id: 9, title: 'Brasil', image: 'https://source.unsplash.com/featured/?brazil', favorited: false },
      { id: 10, title: 'Argentina', image: 'https://source.unsplash.com/featured/?argentina', favorited: false },
      { id: 11, title: 'Chile', image: 'https://source.unsplash.com/featured/?chile', favorited: false },
      { id: 12, title: 'Perú', image: 'https://source.unsplash.com/featured/?peru', favorited: false },
      { id: 13, title: 'México', image: 'https://source.unsplash.com/featured/?mexico', favorited: false },
      { id: 14, title: 'Portugal', image: 'https://source.unsplash.com/featured/?portugal', favorited: false },
      { id: 15, title: 'Grecia', image: 'https://source.unsplash.com/featured/?greece', favorited: false },
      { id: 16, title: 'Australia', image: 'https://source.unsplash.com/featured/?australia', favorited: false },
      { id: 17, title: 'Nueva Zelanda', image: 'https://source.unsplash.com/featured/?new%20zealand', favorited: false },
      { id: 18, title: 'Sudáfrica', image: 'https://source.unsplash.com/featured/?south%20africa', favorited: false },
      { id: 19, title: 'Egipto', image: 'https://source.unsplash.com/featured/?egypt', favorited: false },
      { id: 20, title: 'Noruega', image: 'https://source.unsplash.com/featured/?norway', favorited: false },
      { id: 21, title: 'Suecia', image: 'https://source.unsplash.com/featured/?sweden', favorited: false },
      { id: 22, title: 'Finlandia', image: 'https://source.unsplash.com/featured/?finland', favorited: false },
      { id: 23, title: 'Alemania', image: 'https://source.unsplash.com/featured/?germany', favorited: false },
      { id: 24, title: 'Países Bajos', image: 'https://source.unsplash.com/featured/?netherlands', favorited: false },
      { id: 25, title: 'Suiza', image: 'https://source.unsplash.com/featured/?switzerland', favorited: false },
      { id: 26, title: 'Tailandia', image: 'https://source.unsplash.com/featured/?thailand', favorited: false },
      { id: 27, title: 'Vietnam', image: 'https://source.unsplash.com/featured/?vietnam', favorited: false },
      { id: 28, title: 'Indonesia', image: 'https://source.unsplash.com/featured/?indonesia', favorited: false },
      { id: 29, title: 'India', image: 'https://source.unsplash.com/featured/?india', favorited: false },
      { id: 30, title: 'Corea del Sur', image: 'https://source.unsplash.com/featured/?south%20korea', favorited: false },
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch (e) {
      // ignore storage errors (e.g., quota)
    }
  }, [favorites])

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, favorited: !f.favorited } : f))
      const toggled = updated.find((f) => f.id === id)
      if (!toggled) return updated

      if (toggled.favorited) {
        // move newly favorited item to the top
        return [toggled, ...updated.filter((f) => f.id !== id)]
      }

      // if unfavorited, place it after other favorited items
      const others = updated.filter((f) => f.id !== id)
      const favorited = others.filter((f) => f.favorited)
      const notFavorited = others.filter((f) => !f.favorited)
      return [...favorited, toggled, ...notFavorited]
    })
  }

  return (
    <div className='page'>

      {favorites.map((f) => (
        <FavoriteCard
          key={f.id}
          title={f.title}
          image={f.image}
          isFavorited={f.favorited}
          onToggle={() => toggleFavorite(f.id)}
        />
      ))}

    </div>
  )
}

export default Favoritos
