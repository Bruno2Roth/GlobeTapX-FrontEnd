import '../index.css'
import Header from '../Componentes/Header/Header'
import SearchBar from '../Componentes/SearchBar/SearchBar'
import CategoryTabs from '../Componentes/CategoryTabs/CategoryTabs'
import CardDestino from '../Componentes/CardDestino/CardDestino'

function Explorar() {

  return (
    <div className='page'>

      <Header
        title='Explorar'
        subtitle='Descubrí nuevos destinos'
      />

      <SearchBar />

      <CategoryTabs />

      <CardDestino
        titulo='Santuario Azur'
        pais='Islandia'
      />

      <CardDestino
        titulo='Jardines Kyoto'
        pais='Japón'
      />

    </div>
  )
}

export default Explorar