import './index.css'

function FavoriteCard({
  title = 'Islandia',
  image = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  isFavorited = false,
  onToggle = () => {},
}) {

  return (
    <div className='favoriteCard'>

      <img
        src={image}
        alt={`${title} destino`}
      />

      <div className='favoriteInfo'>

        <h3>{title}</h3>

        <button
          type='button'
          className={`favoriteToggle ${isFavorited ? 'favorited' : ''}`}
          onClick={onToggle}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>

      </div>

    </div>
  )
}

export default FavoriteCard