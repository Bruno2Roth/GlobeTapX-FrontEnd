import '../index.css'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, getFotoPerfil } from "../config";

function Login() {
  const [mail, setmail] = useState("");
  const [contrasena, setcontrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Envía credenciales al backend; si ok guarda token en localStorage y redirige a home
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    localStorage.removeItem("token");

    try {
      const res = await login({ mail, contrasena });
      if (!res.token || res.token.length > 5000) {
        setError("Token inválido del servidor");
        return;
      }
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user?.usuarioID ?? res.user?.id);
      localStorage.setItem("user", JSON.stringify(res.user));
      getFotoPerfil(res.user?.usuarioID ?? res.user?.id)
        .then((f) => {
          if (f?.fotoPerfil) localStorage.setItem("fotoPerfil", f.fotoPerfil);
          else localStorage.removeItem("fotoPerfil");
        })
        .catch(() => localStorage.removeItem("fotoPerfil"));
      navigate("/home");
    } catch (err) {
      setError(err.data?.error || err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>GlobeTapX</h1>
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>mail</label>
            <input
              type="text"
              placeholder="usuario@mail.com"
              value={mail}
              onChange={(e) => setmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
            />
          </div>

          <button type="submit">
            Iniciar Sesión
          </button>
        </form>

        <p className="register-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
