import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Home from "./Pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;