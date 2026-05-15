<<<<<<< HEAD
// Perfil.jsx
export const Perfil = () => (
  <div className="flex flex-col items-center p-10">
    <div className="relative">
      <img src="user.jpg" className="w-32 h-32 rounded-full border-4 border-white shadow-xl" />
      <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white">✏️</button>
    </div>
    <h2 className="mt-4 text-2xl font-bold">Lucía Herrera</h2>
    <p className="text-gray-400">@lucia_travels</p>
    
    <div className="w-full mt-10 space-y-2">
      {['Mis Viajes', 'Métodos de Pago', 'Privacidad', 'Cerrar Sesión'].map(item => (
        <button key={item} className="w-full text-left p-4 hover:bg-gray-50 rounded-2xl font-medium border-b border-gray-50">
          {item}
        </button>
      ))}
    </div>
  </div>
);
=======
import Header from '../Componentes/Header/Header'
import ConfigMenu from '../Componentes/ConfigMenu/ConfigMenu'
import ThemeToggle from '../Componentes/ThemeToggle/ThemeToggle'

function Configuracion() {

  return (
    <div className='page'>

      <Header
        title='Configuración'
        subtitle='Preferencias de la app'
      />

      <ThemeToggle />

      <ConfigMenu />

    </div>
  )
}

export default Configuracion
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
