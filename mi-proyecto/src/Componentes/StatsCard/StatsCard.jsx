<<<<<<< HEAD
export const StatsCard = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  </div>
);
=======
import './StatsCard.css'

function StatsCard() {

  return (
    <div className='statsCard'>

      <div className='stat'>
        <h2>12</h2>
        <p>Países</p>
      </div>

      <div className='stat'>
        <h2>40</h2>
        <p>Vuelos</p>
      </div>

    </div>
  )
}

export default StatsCard
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
