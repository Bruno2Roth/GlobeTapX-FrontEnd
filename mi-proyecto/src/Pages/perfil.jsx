import './Pages.css'
import Header from '../Componentes/Header/Header'
import ProfileCard from '../Componentes/ProfileCard/ProfileCard'
import StatsCard from '../Componentes/StatsCard/StatsCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Perfil() {

  return (
    <div className='page'>

      <Header
        title='Mi Perfil'
        subtitle='Tu información'
      />

      <ProfileCard />

      <StatsCard />

      <BottomNav />

    </div>
  )
}

export default Perfil