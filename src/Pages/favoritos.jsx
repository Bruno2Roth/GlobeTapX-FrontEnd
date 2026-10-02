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
    { id: 1, title: 'Argentina', image: 'https://source.unsplash.com/featured/?argentina', favorited: false },
    { id: 2, title: 'Australia', image: 'https://source.unsplash.com/featured/?australia', favorited: false },
    { id: 3, title: 'Brasil', image: 'https://source.unsplash.com/featured/?brazil', favorited: false },
    { id: 4, title: 'Chile', image: 'https://source.unsplash.com/featured/?chile', favorited: false },
    { id: 5, title: 'China', image: 'https://source.unsplash.com/featured/?china', favorited: false },
    { id: 6, title: 'Corea del Sur', image: 'https://source.unsplash.com/featured/?south%20korea', favorited: false },
    { id: 7, title: 'España', image: 'https://source.unsplash.com/featured/?spain', favorited: true },
    { id: 8, title: 'Estados Unidos', image: 'https://source.unsplash.com/featured/?usa', favorited: false },
    { id: 9, title: 'Francia', image: 'https://source.unsplash.com/featured/?france', favorited: false },
    { id: 10, title: 'Inglaterra', image: 'https://source.unsplash.com/featured/?england', favorited: false },
    { id: 11, title: 'Israel', image: 'https://source.unsplash.com/featured/?israel', favorited: false },
    { id: 12, title: 'Italia', image: 'https://source.unsplash.com/featured/?italy', favorited: false },
]})

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
