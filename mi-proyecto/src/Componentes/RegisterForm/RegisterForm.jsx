import './RegisterForm.css'

function RegisterForm() {

  return (
    <div className='registerForm'>

      <h1>Crear Cuenta</h1>

      <input type='text' placeholder='Nombre' />

      <input type='email' placeholder='Email' />

      <input type='password' placeholder='Contraseña' />

      <input type='password' placeholder='Confirmar contraseña' />

      <button>Registrarse</button>

    </div>
  )
}

export default RegisterForm