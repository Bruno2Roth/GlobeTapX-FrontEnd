import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import TopBar from "./Componentes/TopBar/TopBar";
import Footer from "./Componentes/Footer/Footer";

import Landing from "./Pages/landing";
import Login from "./Pages/login";
import Registro from "./Pages/registro";
import Home from "./Pages/home";
import Clima from "./Pages/clima";
import Cambio from "./Pages/cambio";
import NumEmergencia from "./Pages/numEmergencia";
import Idioma from "./Pages/idioma";
import Agenda from "./Pages/agenda";
import Reglas from "./Pages/reglas";
import Favoritos from "./Pages/favoritos";
import Perfil from "./Pages/perfil";
import Historial from "./Pages/historial";
import CrearGuia from "./Pages/crearGuia";
import Alojamiento from "./Pages/alojamiento";
import Eventos from "./Pages/eventos";
import DetalleEvento from "./Pages/detalleEvento";
import Horario from "./Pages/horario";
import Documentacion from "./Pages/documentacion";
import VidaDiaria from "./Pages/vidaDiaria";
import { useSession } from "./context/SessionContext";
import { normalizeLanguageCode, translatePage } from "./helpers/translatePage";

function preferredLanguageFromUser(user) {
  if (user?.idiomaPreferido && typeof user.idiomaPreferido === "object") {
    return user.idiomaPreferido.codigoIdioma;
  }
  return user?.idiomaPreferido;
}

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useSession();
  if (loading) return <div className="session-loading">Cargando sesión...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();
  const { user, loading } = useSession();
  const mostrarLayout = !["/", "/registro", "/landing"].includes(location.pathname);

  useEffect(() => {
    if (loading) return;
    const language = normalizeLanguageCode(
      user ? preferredLanguageFromUser(user) : "es",
    );
    void translatePage(language).catch((error) => {
      console.warn("No se pudo aplicar el idioma de la pantalla:", error);
    });
  }, [loading, location.pathname, user]);

  return (
    <>
      {mostrarLayout && <TopBar />}
      <div className={mostrarLayout ? "page-wrapper" : ""}>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/clima" element={<ProtectedRoute><Clima /></ProtectedRoute>} />
          <Route path="/cambio" element={<ProtectedRoute><Cambio /></ProtectedRoute>} />
          <Route path="/numEmergencia" element={<ProtectedRoute><NumEmergencia /></ProtectedRoute>} />
          <Route path="/idioma" element={<ProtectedRoute><Idioma /></ProtectedRoute>} />
          <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
          <Route path="/reglas" element={<ProtectedRoute><Reglas /></ProtectedRoute>} />
          <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
          <Route path="/configuracion" element={<Navigate to="/perfil" replace />} />
          <Route path="/editarPerfil" element={<ProtectedRoute><Navigate to="/perfil" replace /></ProtectedRoute>} />
          <Route path="/crearGuia" element={<ProtectedRoute><CrearGuia /></ProtectedRoute>} />
          <Route path="/alojamiento" element={<ProtectedRoute><Alojamiento /></ProtectedRoute>} />
          <Route path="/eventos" element={<ProtectedRoute><Eventos /></ProtectedRoute>} />
          <Route path="/evento/:id" element={<ProtectedRoute><DetalleEvento /></ProtectedRoute>} />
          <Route path="/horario" element={<ProtectedRoute><Horario /></ProtectedRoute>} />
          <Route path="/documentacion" element={<ProtectedRoute><Documentacion /></ProtectedRoute>} />
          <Route path="/vida" element={<ProtectedRoute><VidaDiaria /></ProtectedRoute>} />
          <Route path="/vidaDiaria" element={<ProtectedRoute><VidaDiaria /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      {mostrarLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
