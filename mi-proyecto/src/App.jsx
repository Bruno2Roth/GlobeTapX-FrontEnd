import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import TopBar from "./Componentes/TopBar/TopBar";
import Footer from "./Componentes/Footer/Footer";

import Login from "./Pages/login";
import Registro from "./Pages/registro";
import Home from "./Pages/home";
import Clima from "./Pages/clima";
import Cambio from "./Pages/cambio";
import NumEmergencia from "./Pages/numEmergencia";
import Idioma from "./Pages/idioma";
import Agenda from "./Pages/agenda";
import Reglas from "./Pages/reglas";
import Explorar from "./Pages/explorar";
import Favoritos from "./Pages/favoritos";
import Perfil from "./Pages/perfil";
import Historial from "./Pages/historial";
import Configuracion from "./Pages/configuracion";
import EditarPerfil from "./Pages/editarPerfil";
import CrearGuia from "./Pages/crearGuia";
import Alojamiento from "./Pages/alojamiento";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const location = useLocation();

  const publicRoutes = ["/", "/registro"];
  const mostrarLayout = !publicRoutes.includes(location.pathname);

  return (
    <>
      {mostrarLayout && <><TopBar /><Footer /></>}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/clima" element={<ProtectedRoute><Clima /></ProtectedRoute>} />
        <Route path="/cambio" element={<ProtectedRoute><Cambio /></ProtectedRoute>} />
        <Route path="/numEmergencia" element={<ProtectedRoute><NumEmergencia /></ProtectedRoute>} />
        <Route path="/idioma" element={<ProtectedRoute><Idioma /></ProtectedRoute>} />
        <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
        <Route path="/reglas" element={<ProtectedRoute><Reglas /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
        <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><Configuracion /></ProtectedRoute>} />
        <Route path="/editarPerfil" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
        <Route path="/crearGuia" element={<ProtectedRoute><CrearGuia /></ProtectedRoute>} />
        <Route path="/alojamiento" element={<ProtectedRoute><Alojamiento /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
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
