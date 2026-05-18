import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        {/* Reemplaza con tu logo real */}
        <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
        <span className="font-bold text-xl text-gray-800">GlobeTap</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <a href="#" className="hover:text-blue-600">Explorar</a>
        <a href="#" className="hover:text-blue-600">Favoritos</a>
        <a href="#" className="hover:text-blue-600">Mi Agenda</a>
      </div>

      <div className="flex items-center gap-3">
        <img 
          src="https://via.placeholder.com/40" 
          alt="User Profile" 
          className="w-10 h-10 rounded-full border border-gray-200"
        />
      </div>
    </nav>
  );
};

export default Navbar;