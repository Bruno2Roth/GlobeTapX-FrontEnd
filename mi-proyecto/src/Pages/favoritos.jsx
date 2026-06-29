import '../index.css'
import Header from '../Componentes/Header/Header'
import FavoriteCard from '../Componentes/FavoriteCard/FavoriteCard'

function Favoritos() {

  return (
    <div className='page'>

      <Header
        title='Favoritos'
        subtitle='Destinos guardados'
      />

      <FavoriteCard />

      <FavoriteCard />

    </div>
  )
}

export default Favoritos
