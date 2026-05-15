import Header from '../Componentes/Header/Header'
import SearchBar from '../Componentes/SearchBar/SearchBar'
import FilterButtons from '../Componentes/FilterButtons/FilterButtons'
import CardAlojamiento from '../Componentes/CardAlojamiento/CardAlojamiento'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Alojamiento() {

  return (
    <div className='page'>

      <Header
        title='Encontrá tu Santuario'
        subtitle='Hospedajes recomendados'
      />

      <SearchBar />

      <FilterButtons />

      <CardAlojamiento
        nombre='Azure Shore Retreat'
        lugar='Grecia'
      />

      <CardAlojamiento
        nombre='Jardines Kyoto'
        lugar='Japón'
      />

      <BottomNav />

    </div>
  )
}

export default Alojamiento