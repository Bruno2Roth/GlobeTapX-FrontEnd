import Header from '../Componentes/Header/Header'
import TripCard from '../Componentes/TripCard/TripCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Historial() {

  return (
    <div className='page'>

      <Header
        title='Historial'
        subtitle='Tus viajes anteriores'
      />

      <TripCard />

      <TripCard />

      <BottomNav />

    </div>
  )
}

export default Historial