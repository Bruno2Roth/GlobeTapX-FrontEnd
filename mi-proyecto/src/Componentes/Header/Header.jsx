import "./index.css";

export const Header = ({ title, subtitle }) => {
  const fotoRaw = localStorage.getItem("fotoPerfil");
  const foto = fotoRaw && fotoRaw !== "null" && fotoRaw !== "undefined" ? fotoRaw : "";

  return (
    <header className="page-header">
      <div className="page-header-left">
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>
      <div className="page-header-right">
        <button className="page-header-btn">🔔</button>
        <div className="page-header-avatar">
          {foto ? (
            <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          ) : (
            "U"
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
