import { NavLink } from 'react-router-dom';
import "./index.css";

export const Sidebar = () => {
  const links = [
    { to: "/home", icon: "🏠", label: "Home" },
    { to: "/explorar", icon: "🔍", label: "Explorar" },
    { to: "/agenda", icon: "📅", label: "Agenda" },
    { to: "/favoritos", icon: "❤️", label: "Favoritos" },
    { to: "/perfil", icon: "👤", label: "Perfil" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">GT</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
