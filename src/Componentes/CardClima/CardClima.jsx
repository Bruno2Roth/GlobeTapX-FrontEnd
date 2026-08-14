import './index.css'

function CardClima({ ciudad, temperatura, estado }) {

  return (
    <div className='cardClima'>

      <h2>{ciudad}</h2>

      <h1>{temperatura}</h1>

      <p>{estado}</p>

    </div>
  )
}

export default CardClima