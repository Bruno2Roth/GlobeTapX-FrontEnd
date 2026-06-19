import "./index.css";

function Navbar() {
  return (
    <header className="navbar">

      <div className="nav-left">

        <button className="menu-btn">☰</button>

        <div className="logo">
          <img src="/logoPestaña.png" alt="Logo" />
          <h2>GlobeTapX</h2>
        </div>

      </div>

      <div className="nav-right">

        <button className="icon-btn">🔔</button>

        <img
          className="perfil"
          src="/perfil.png"
          alt="Perfil"
        />

      </div>

    </header>
  );
}

export default Navbar;