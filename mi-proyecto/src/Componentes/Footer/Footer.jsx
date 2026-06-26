import { Link } from "react-router-dom";
import "./index.css";

function Footer() {
  return (
    <footer className="bottom-nav">
      <Link to="/home"><span>Inicio</span></Link>
      <Link to="/clima"><span>Clima</span></Link>
      <Link to="/cambio"><span>Cambio</span></Link>
      <Link to="/numEmergencia"><span>Ayuda</span></Link>
    </footer>
  );
}

export default Footer;
