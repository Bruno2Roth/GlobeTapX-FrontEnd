import { useEffect } from "react";
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
import { getCurrentUser, getFotoPerfil } from "./config";
import { normalizeLanguageCode, setPreferredLanguage, translatePage } from "./helpers/translatePage";
import { clearAuthSession, getAuthSession, setAuthSession } from "./services/authSession";
import { CONNECTION_ERROR_MESSAGE } from "./helpers/errorMessages";

function unwrapUser(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

function unwrapPhoto(response) {
  const payload = response?.data ?? response;
  return typeof payload?.fotoPerfil === "string" ? payload.fotoPerfil : "";
}

function preferredLanguageFromUser(user) {
  if (user?.idiomaPreferido && typeof user.idiomaPreferido === "object") {
    return user.idiomaPreferido.codigoIdioma;
  }
  return user?.idiomaPreferido;
}

function AuthSessionSync() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return undefined;
    // Login y registro ya dejaron la sesión completa en memoria.
    if (getAuthSession().user?.id) return undefined;
    let active = true;

    const synchronize = async () => {
      try {
        const response = await getCurrentUser();
        const user = unwrapUser(response);
        if (!user?.id) throw new Error(CONNECTION_ERROR_MESSAGE);

        if (!active) return;
        const initialPhoto = typeof user.fotoPerfil === "string" ? user.fotoPerfil : "";
        setAuthSession(user, initialPhoto);

        // La sesión queda disponible mientras se renuevan los datos secundarios.
        void getFotoPerfil(user.id)
          .then((photoResponse) => {
            if (!active) return;
            const photo = unwrapPhoto(photoResponse);
            if (photo) setAuthSession({ ...user, fotoPerfil: photo }, photo);
          })
          .catch((photoError) => console.warn("No se pudo cargar la foto de sesión:", photoError));

        const language = normalizeLanguageCode(
          preferredLanguageFromUser(user) || localStorage.getItem("preferredLanguage") || "es",
        );
        void translatePage(language)
          .then((appliedLanguage) => {
            if (active) setPreferredLanguage(appliedLanguage);
          })
          .catch((translationError) => console.warn("No se pudo sincronizar el idioma:", translationError));
      } catch (error) {
        const status = Number(error?.status);
        if ([401, 403].includes(status)) {
          clearAuthSession();
          window.location.href = "/";
        }
        console.warn("No se pudo sincronizar la sesión:", error);
      }
    };

    void synchronize();
    return () => { active = false; };
  }, [token]);

  return null;
}

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
      <AuthSessionSync />
      {mostrarLayout && <TopBar />}
      <div className={mostrarLayout ? "page-wrapper" : ""}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path="/clima" element={<ProtectedRoute><Clima/></ProtectedRoute>}/>
          <Route path="/cambio" element={<ProtectedRoute><Cambio/></ProtectedRoute>}/>
          <Route path="/numEmergencia" element={<ProtectedRoute><NumEmergencia/></ProtectedRoute>}/>
          <Route path="/idioma" element={<ProtectedRoute><Idioma/></ProtectedRoute>}/>
          <Route path="/agenda" element={<ProtectedRoute><Agenda/></ProtectedRoute>}/>
          <Route path="/reglas" element={<ProtectedRoute><Reglas/></ProtectedRoute>}/>
          <Route path="/favoritos" element={<ProtectedRoute><Favoritos/></ProtectedRoute>}/>
          <Route path="/perfil" element={<ProtectedRoute><Perfil/></ProtectedRoute>}/>
          <Route path="/historial" element={<ProtectedRoute><Historial/></ProtectedRoute>}/>
          <Route path="/configuracion" element={<Navigate to="/perfil" replace />} />
          <Route path="/editarPerfil" element={<ProtectedRoute><Navigate to="/perfil" replace /></ProtectedRoute>}/>
          <Route path="/crearGuia" element={<ProtectedRoute><CrearGuia/></ProtectedRoute>}/>
          <Route path="/alojamiento" element={<ProtectedRoute><Alojamiento/></ProtectedRoute>}/>
          <Route path="/eventos" element={<ProtectedRoute><Eventos/></ProtectedRoute>}/>
          <Route path="/evento/:id" element={<ProtectedRoute><DetalleEvento/></ProtectedRoute>}/>
          <Route path="/horario" element={<Horario />} />          
          <Route path="/documentacion" element={<ProtectedRoute><Documentacion/></ProtectedRoute>}/>
          <Route path="/vida" element={<ProtectedRoute><VidaDiaria/></ProtectedRoute>}/>
          <Route path="/vidaDiaria" element={<ProtectedRoute><VidaDiaria/></ProtectedRoute>}/>

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
