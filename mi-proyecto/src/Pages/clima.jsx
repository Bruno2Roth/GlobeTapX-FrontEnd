export const Clima = () => {
  return (
    <div className="p-8 bg-white flex flex-col items-center text-center">
      <p className="text-gray-400 font-medium">Santorini, Grecia</p>
      <h1 className="text-xl font-bold mb-8">Mayormente Soleado</h1>
      
      <div className="w-48 h-48 rounded-full border-[12px] border-blue-50 flex flex-col justify-center items-center mb-8">
        <span className="text-6xl font-bold">28°</span>
      </div>

      <div className="w-full bg-blue-50/50 rounded-3xl p-6">
        <h4 className="font-bold text-left mb-4">Previsión de 5 días</h4>
        <div className="space-y-4">
          {['Mañana', 'Lunes', 'Martes'].map(dia => (
            <div key={dia} className="flex justify-between items-center">
              <span>{dia}</span>
              <span className="font-bold">24° / 29°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};