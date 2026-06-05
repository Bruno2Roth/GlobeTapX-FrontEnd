import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Home from "./Pages/home";
import Clima from "./Pages/clima";
import Cambio from "./Pages/cambio";

function App() {
  return (
    <BrowserRouter>

     <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/home" element={<Home />} />
  <Route path="/clima" element={<Clima />} />
  <Route path="/cambio" element={<Cambio />} />
    </Routes>

    </BrowserRouter>
  );
}

export default App;