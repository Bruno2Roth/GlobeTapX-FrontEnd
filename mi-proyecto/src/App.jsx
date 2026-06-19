import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Componentes/Navbar/Navbar";
import Footer from "./Componentes/Footer/Footer";

import Login from "./Pages/login";
import Home from "./Pages/home";
import Clima from "./Pages/clima";
import Cambio from "./Pages/cambio";
import NumEmergencia from "./Pages/numEmergencia";
import Idioma from "./Pages/Idioma";

function AppContent() {
  const location = useLocation();

  const mostrarLayout = location.pathname !== "/";

  return (
    <>
      {mostrarLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clima" element={<Clima />} />
        <Route path="/cambio" element={<Cambio />} />
        <Route path="/numEmergencia" element={<NumEmergencia />} />
        <Route path="/Idioma" element={<Idioma />} />
        <Route path="/agenda" element={<agenda />} />
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