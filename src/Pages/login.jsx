import "../index.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { useSession } from "../context/SessionContext";

function Login() {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: loginSession } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      await loginSession({ mail, contrasena });
      navigate("/home");
    } catch (requestError) {
      console.error("Login request failed", requestError);
      const status = Number(requestError?.status ?? requestError?.response?.status);
      const backendMessage = [
        requestError?.data?.error,
        requestError?.data?.message,
        requestError?.data?.title,
        typeof requestError?.data === "string" ? requestError.data : "",
      ].filter(Boolean).join(" ").toLowerCase();
      const messageIndicatesInvalidCredentials = /((credencial|credential|usuario|user|mail|email|contrase\u00f1a|password|clave).*(incorrect|invalid|inv\u00e1lid|incorrecta|incorrecto|no encontrado|not found))|((incorrect|invalid|inv\u00e1lid|incorrecta|incorrecto|no encontrado|not found).*(credencial|credential|usuario|user|mail|email|contrase\u00f1a|password|clave))/i.test(backendMessage);
      const credentialsAreInvalid = [401, 403].includes(status)
        || ([400, 422].includes(status) && messageIndicatesInvalidCredentials);

      setError(credentialsAreInvalid ? "Credenciales incorrectas" : CONNECTION_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-container login-container--simple">
      <section className="login-card login-card--simple">
        <div className="login-panel">
          <div className="login-wordmark auth-brand">
            <span className="auth-brand__mark">G</span>
            <span>GlobeTapX</span>
          </div>

          <div className="login-heading">
            <h1>Iniciar sesión</h1>
            <p>Ingresá con tu correo y contraseña para continuar.</p>
          </div>

          {error && <p className="error-msg" role="alert"><span aria-hidden="true">!</span>{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-mail">Correo electrónico</label>
              <div className="input-control">
                <input
                  id="login-mail"
                  type="email"
                  name="mail"
                  placeholder="tu@correo.com"
                  value={mail}
                  onChange={(event) => setMail(event.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Contraseña</label>
              <div className="input-control">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ingresá tu contraseña"
                  value={contrasena}
                  onChange={(event) => setContrasena(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Conectando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="register-link">
            ¿Todavía no tenés cuenta? <Link to="/registro">Crear una cuenta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
