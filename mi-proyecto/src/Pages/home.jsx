import Header from '../Componentes/Header/Header'
import HeroBanner from '../Componentes/HeroBanner/HeroBanner'
import SearchBar from '../Componentes/SearchBar/SearchBar'
import CardDestino from '../Componentes/CardDestino/CardDestino'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Home() {
  return (
    <div className='page'>

      <Header
        title='Tus Favoritos'
        subtitle='Explorá destinos increíbles'
      />

      <HeroBanner />

      <SearchBar />

      <CardDestino
        titulo='Positano Cliffs'
        pais='Italia'
        imagen='URL'
      />

      <CardDestino
        titulo='Auroras Boreales'
        pais='Islandia'
        imagen='URL'
      />

      <BottomNav />

    </div>
  )
}

export default Home