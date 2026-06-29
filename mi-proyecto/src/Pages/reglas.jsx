import '../index.css'
import Header from '../Componentes/Header/Header'
import CardEmergencia from '../Componentes/CardEmergencia/CardEmergencia'
import NotificationCard from '../Componentes/NotificationCard/NotificationCard'

function Reglas() {

  return (
    <div className='page'>

      <Header
        title='Normas y Guía'
        subtitle='Información importante'
      />

      <NotificationCard />

      <CardEmergencia />

    </div>
  )
}

export default Reglas
