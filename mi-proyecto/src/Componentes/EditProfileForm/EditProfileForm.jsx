import './EditProfileForm.css'

function EditProfileForm() {

  return (
    <div className='editProfileForm'>

      <input
        type='text'
        placeholder='Nuevo nombre'
      />

      <input
        type='text'
        placeholder='Nueva descripción'
      />

      <input
        type='file'
      />

      <button>
        Guardar cambios
      </button>

    </div>
  )
}

export default EditProfileForm