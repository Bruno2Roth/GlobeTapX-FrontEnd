import "./index.css";

export const Header = ({ title, subtitle }) => (
  <header className="page-header">
    <div className="page-header-left">
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
    <div className="page-header-right">
      <button className="page-header-btn">🔔</button>
      <div className="page-header-avatar">U</div>
    </div>
  </header>
);

export default Header;
