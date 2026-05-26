import './LoginForm.css'

function LoginForm() {

  return (
    <div className='loginForm'>

      <h1>Iniciar Sesión</h1>

      <input
        type='email'
        placeholder='Email'
      />

      <input
        type='password'
        placeholder='Contraseña'
      />

      <button>
        Ingresar
      </button>

    </div>
  )
}

export default LoginForm