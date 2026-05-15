import Header from '../Componentes/Header/Header'
import Calendar from '../Componentes/Calendar/Calendar'
import ActivityTimeline from '../Componentes/ActivityTimeline/ActivityTimeline'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Agenda() {

  return (
    <div className='page'>

      <Header
        title='Mi Agenda'
        subtitle='Organizá tus viajes'
      />

      <Calendar />

      <ActivityTimeline />

      <BottomNav />

    </div>
  )
}

export default Agenda