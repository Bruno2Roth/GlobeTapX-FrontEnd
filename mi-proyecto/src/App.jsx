import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./Componentes/Navbar/Navbar";
import Footer from "./Componentes/Footer/Footer";

import Login from "./Pages/login";
import Registro from "./Pages/registro";
import Home from "./Pages/home";
import Clima from "./Pages/clima";
import Cambio from "./Pages/cambio";
import NumEmergencia from "./Pages/numEmergencia";
import Idioma from "./Pages/Idioma";
import Agenda from "./Pages/agenda";

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
      {mostrarLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/clima" element={<ProtectedRoute><Clima /></ProtectedRoute>} />
        <Route path="/cambio" element={<ProtectedRoute><Cambio /></ProtectedRoute>} />
        <Route path="/numEmergencia" element={<ProtectedRoute><NumEmergencia /></ProtectedRoute>} />
        <Route path="/Idioma" element={<ProtectedRoute><Idioma /></ProtectedRoute>} />
        <Route path="/Agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
      </Routes>

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
