import './Pages.css'
import Header from '../Componentes/Header/Header'
import LanguageSelector from '../Componentes/LanguageSelector/LanguageSelector'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Idioma() {

  return (
    <div className='page'>

      <Header
        title='Idioma'
        subtitle='Frases útiles para viajar'
      />

      <LanguageSelector />

      <BottomNav />

    </div>
  )
}

export default Idioma