import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Home from "./Pages/home";
import Clima from "./Pages/clima";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clima" element={<Clima />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;