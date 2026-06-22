import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import './index.css'

function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", { nombre, email, password, fechaNacimiento });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user?.usuarioID ?? res.data.user?.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div className='registerForm'>

      <form onSubmit={handleSubmit}>

        <h1>Crear Cuenta</h1>

        {error && <p className="error-msg">{error}</p>}

        <input
          type='text'
          placeholder='Nombre'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type='password'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="birth-label">Fecha de nacimiento</label>
        <input
          type='date'
          placeholder='Fecha de nacimiento'
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      <p className="login-link">
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
      </p>

    </div>
  )
}

export default RegisterForm
