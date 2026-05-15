export const Alojamiento = () => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Encuentra tu santuario</h2>
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['Todo', 'Hotel', 'Villa', 'Cabaña'].map(cat => (
          <button key={cat} className="px-4 py-2 rounded-full border text-sm">{cat}</button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100">
          <img src="hotel.jpg" className="w-full h-48 object-cover" />
          <div className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">The Azure Shore</h3>
              <span className="text-blue-600 font-bold">$250/nt</span>
            </div>
            <p className="text-gray-400 text-sm">Santorini, Grecia</p>
            <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-2xl font-bold">Reservar ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
};