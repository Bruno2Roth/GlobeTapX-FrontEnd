import Header from '../Componentes/Header/Header'
import CardClima from '../Componentes/CardClima/CardClima'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Clima() {

  return (
    <div className='page'>

      <Header
        title='Clima'
        subtitle='Pronóstico actual'
      />

      <CardClima
        ciudad='Tokio'
        temperatura='28°'
        estado='Mayormente soleado'
      />

      <BottomNav />

    </div>
  )
}

export default Clima