import '../index.css'
import Header from '../Componentes/Header/Header'
import FavoriteCard from '../Componentes/FavoriteCard/FavoriteCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Favoritos() {

  return (
    <div className='page'>

      <Header
        title='Favoritos'
        subtitle='Destinos guardados'
      />

      <FavoriteCard />

      <FavoriteCard />

      <BottomNav />

    </div>
  )
}

export default Favoritos
