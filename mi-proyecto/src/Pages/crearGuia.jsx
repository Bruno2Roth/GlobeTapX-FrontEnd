import './Pages.css'
import Header from '../Componentes/Header/Header'
import InputField from '../Componentes/InputField/InputField'
import ButtonPrimary from '../Componentes/ButtonPrimary/ButtonPrimary'

function CrearGuia() {

  return (
    <div className='page'>

      <Header
        title='Crear Guía'
        subtitle='Compartí consejos de viaje'
      />

      <InputField placeholder='Título de la guía' />

      <InputField placeholder='Descripción' />

      <ButtonPrimary text='Publicar' />

    </div>
  )
}

export default CrearGuia