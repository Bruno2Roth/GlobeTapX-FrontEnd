export const Agenda = () => {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-1">Mi Agenda.</h1>
      <p className="text-blue-500 font-medium mb-6">Enero 2026</p>
      
      {/* Grid del Calendario */}
      <div className="grid grid-cols-7 gap-2 mb-8 text-center text-sm">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
          <div key={d} className="text-gray-400 font-bold">{d}</div>
        ))}
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className={`py-2 rounded-xl ${i === 13 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
            {i + 1}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-bold">Actividades</h3>
        <div className="flex gap-4 p-4 bg-gray-50 rounded-3xl border-l-4 border-blue-500">
          <div className="text-blue-500 font-bold">14:00</div>
          <div>
            <p className="font-bold">Tour en Positano</p>
            <p className="text-xs text-gray-400">Punto de encuentro: Marina Grande</p>
          </div>
        </div>
      </div>
    </div>
  );
};