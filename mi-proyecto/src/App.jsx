import React from 'react';
import './App.css';

function App() {
  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1 className="brand-name">GlobeTapX</h1>
          <h2 className="main-title">
            Tu viaje comienza con un <span className="highlight">clic</span>.
          </h2>
          <p className="subtitle">
            Bienvenido de nuevo a tu panel de control global.
          </p>
        </header>

        <form className="login-form">
          <div className="input-group">
            <label htmlFor="email">EMAIL O USUARIO</label>
            <input 
              type="text" 
              id="email" 
              placeholder="lucia@globetapx.com" 
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">CONTRASEÑA</label>
              <a href="#" className="forgot-password">Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              id="password" 
              placeholder="........" 
            />
          </div>

          <button type="submit" className="btn-primary">INICIAR</button>
        </form>

        <div className="divider">
          <span>CONTINUAR CON</span>
        </div>

        <div className="social-login">
          <button className="btn-social">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
            Google
          </button>
          <button className="btn-social">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" />
            Facebook
          </button>
        </div>

        <footer className="login-footer">
          <p>¿No tienes una cuenta? <a href="#">Crea una cuenta</a></p>
        </footer>
      </div>
    </div>
  );
}

export default App;