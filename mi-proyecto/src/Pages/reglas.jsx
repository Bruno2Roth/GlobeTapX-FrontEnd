<<<<<<< HEAD
export const Reglas = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Normas y Guía de Viaje</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-blue-600 mb-2">Etiqueta Cultural</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Es importante vestir de forma respetuosa al visitar templos y sitios históricos.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-red-500 mb-2">Emergencias</h3>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
            <span className="font-bold">Policía</span>
            <span className="text-red-600 font-black">911</span>
          </div>
        </div>
      </div>
    </div>
  );
};
=======
import Header from '../Componentes/Header/Header'
import CardEmergencia from '../Componentes/CardEmergencia/CardEmergencia'
import NotificationCard from '../Componentes/NotificationCard/NotificationCard'
import BottomNav from '../Componentes/BottomNav/BottomNav'

function Reglas() {

  return (
    <div className='page'>

      <Header
        title='Normas y Guía'
        subtitle='Información importante'
      />

      <NotificationCard />

      <CardEmergencia />

      <BottomNav />

    </div>
  )
}

export default Reglas
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
