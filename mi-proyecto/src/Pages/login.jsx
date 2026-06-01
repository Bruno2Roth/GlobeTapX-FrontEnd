import './Pages.css'
import React, { useState } from 'react';
import '../App.css'; // Los dos puntos (..) salen de Pages y buscan App.css en src

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', email, password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <span className="top-text">Iniciar Sesión</span>
          <h1 className="logo-title">GlobeTapX</h1>
          <h2 className="welcome-title">
            Tu viaje comienza con un <span className="highlight-text">clic.</span>
          </h2>
          <p className="welcome-subtitle">
            Bienvenido de nuevo a tu panel de control global.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">EMAIL O USUARIO</label>
            <input 
              type="text" 
              id="email"
              placeholder="user@globetapx.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">CONTRASEÑA</label>
              <a href="#forgot" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit">INICIAR</button>
        </form>

        <div className="divider">
          <span>CONTINUAR CON</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="btn-social btn-google">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg" alt="Google" />
            Google
          </button>
          <button type="button" className="btn-social btn-facebook">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" />
            Facebook
          </button>
        </div>

        <div className="login-footer">
          <p>¿No tienes una cuenta? <a href="#register" className="create-account-link">Crea una cuenta</a></p>
        </div>

      </div>
    </div>
  );
}

export default Login;