<div className="navbar">

  <Link to="/explorar" className={location.pathname === "/explorar" ? "active" : ""}>
    <span>🌍</span>
    <p>Explore</p>
  </Link>

  <Link to="/favoritos" className={location.pathname === "/favoritos" ? "active" : ""}>
    <span>🤍</span>
    <p>Favorites</p>
  </Link>

  <Link to="/" className={location.pathname === "/" ? "active" : ""}>
    <span>🏠</span>
    <p>Home</p>
  </Link>

  <Link to="/facts" className={location.pathname === "/facts" ? "active" : ""}>
    <span>💡</span>
    <p>Facts</p>
  </Link>

  <Link to="/perfil" className={location.pathname === "/perfil" ? "active" : ""}>
    <span>👤</span>
    <p>Profile</p>
  </Link>

</div>