import './Pages.css'
import Header from '../Componentes/Header/Header'
import ConfigMenu from '../Componentes/ConfigMenu/ConfigMenu'
import ThemeToggle from '../Componentes/ThemeToggle/ThemeToggle'

function Configuracion() {

  return (
    <div className='page'>

      <Header
        title='Configuración'
        subtitle='Preferencias de la app'
      />

      <ThemeToggle />

      <ConfigMenu />

    </div>
  )
}

export default Configuracion
