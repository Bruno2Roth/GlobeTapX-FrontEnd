import Header from '../Componentes/Header/Header'
import CardEmergencia from '../Componentes/CardEmergencia/CardEmergencia'
import NotificationCard from '../Componentes/NotificationCard/NotificationCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Reglas() {

  return (
    <div className='page'>

      <Header
        title='Normas y Guía'
        subtitle='Información importante'
      />

      <NotificationCard />

      <CardEmergencia />

      <BottomNav />

    </div>
  )
}

export default Reglas