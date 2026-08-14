import '../index.css'
import Header from '../Componentes/Header/Header'
import TripCard from '../Componentes/TripCard/TripCard'

function Historial() {

  return (
    <div className='page'>

      <Header
        title='Historial'
        subtitle='Tus viajes anteriores'
      />

      <TripCard />

      <TripCard />


    </div>
  )
}

export default Historial