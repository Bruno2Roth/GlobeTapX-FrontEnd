import '../index.css'
import Header from '../Componentes/Header/Header'
import EditProfileForm from '../Componentes/EditProfileForm/EditProfileForm'

function EditarPerfil() {

  return (
    <div className='page'>

      <Header
        title='Editar Perfil'
        subtitle='Actualizá tus datos'
      />

      <EditProfileForm />

    </div>
  )
}

export default EditarPerfil