import './CardAlojamiento.css'

function CardAlojamiento({ nombre, lugar }) {

  return (
    <div className='cardAlojamiento'>

      <img
        src='https://images.unsplash.com/photo-1566073771259-6a8506099945'
        alt='hotel'
      />

      <div className='alojamientoInfo'>

        <h3>{nombre}</h3>

        <p>{lugar}</p>

        <span>⭐⭐⭐⭐</span>

      </div>

    </div>
  )
}

export default CardAlojamiento