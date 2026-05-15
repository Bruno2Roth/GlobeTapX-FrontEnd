import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  const links = [
    { to: "/", icon: "🏠", label: "Home" },
    { to: "/explorar", icon: "🔍", label: "Explorar" },
    { to: "/agenda", icon: "📅", label: "Agenda" },
    { to: "/favoritos", icon: "❤️", label: "Favoritos" },
    { to: "/perfil", icon: "👤", label: "Perfil" }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 bg-white border-r shadow-sm z-50">
      <div className="w-12 h-12 bg-blue-600 rounded-2xl mb-10 flex items-center justify-center text-white font-bold">GT</div>
      
      <nav className="flex flex-col gap-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `text-2xl p-2 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-blue-400'}`
            }
          >
            {link.icon}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};