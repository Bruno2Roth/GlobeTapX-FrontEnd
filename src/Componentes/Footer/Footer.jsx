import { Link } from "react-router-dom";
import "./index.css";

function Footer() {
  return (
    <footer className="bottom-nav">
      <Link to="/home"><span data-translate="Inicio">Inicio</span></Link>
      <Link to="/clima"><span data-translate="Clima">Clima</span></Link>
      <Link to="/cambio"><span data-translate="Cambio">Cambio</span></Link>
      <Link to="/numEmergencia"><span data-translate="Ayuda">Ayuda</span></Link>
    </footer>
  );
}

export default Footer;
