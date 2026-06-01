import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>GlobeTapX</h1>
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">
            Iniciar Sesión
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;