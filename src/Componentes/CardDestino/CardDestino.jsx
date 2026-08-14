import './index.css'

function CardDestino({ titulo, pais, imagen }) {

  return (
    <div className='cardDestino'>

      <img
        src={imagen}
        alt={titulo}
      />

      <div className='destinoInfo'>

        <h3>{titulo}</h3>

        <p>{pais}</p>

        <button>Explorar</button>

      </div>

    </div>
  )
}

export default CardDestino