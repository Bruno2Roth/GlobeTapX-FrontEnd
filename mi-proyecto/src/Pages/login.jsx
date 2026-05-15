import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Aquí podrías validar el usuario, pero por ahora vamos directo al Home
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-xl flex flex-col items-center">
        
        {/* Logo */}
        <h2 className="text-[#002855] font-bold text-xl mb-10">GlobeTapX</h2>

        {/* Título */}
        <h1 className="text-4xl font-bold text-center leading-tight mb-4">
          Tu viaje comienza con un <span className="text-orange-400">clic.</span>
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Bienvenido de nuevo a tu panel de control global.
        </p>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">Email o Usuario</label>
            <input 
              type="text" 
              placeholder="user@gmail.com"
              className="w-full bg-gray-100 p-4 rounded-2xl mt-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contraseña</label>
              <button type="button" className="text-[10px] text-orange-300 font-bold">¿Olvidaste tu contraseña?</button>
            </div>
            <input 
              type="password" 
              placeholder="********"
              className="w-full bg-gray-100 p-4 rounded-2xl mt-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#001A41] text-white py-4 rounded-full font-bold text-lg hover:bg-[#002855] transition-colors shadow-lg"
          >
            INICIAR
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center w-full my-8">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="px-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Continuar con</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4 w-full mb-10">
          <button className="flex-1 bg-gray-100 py-3 rounded-2xl font-bold text-sm">Google</button>
          <button className="flex-1 bg-gray-100 py-3 rounded-2xl font-bold text-sm">Facebook</button>
        </div>

        {/* Registro */}
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta? <button onClick={() => navigate('/registro')} className="text-[#001A41] font-bold">Crea una cuenta</button>
        </p>
      </div>
    </div>
  );
};