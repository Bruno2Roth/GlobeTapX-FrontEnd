<<<<<<< HEAD
export const MissionCard = ({ title, image, tag }) => (
  <div className="relative rounded-[2rem] overflow-hidden h-48 w-full shadow-md">
    <img src={image} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-end">
      <span className="text-xs text-white/80">{tag}</span>
      <h3 className="text-white font-bold">{title}</h3>
    </div>
  </div>
);
=======
import './MissionCard.css'

function MissionCard() {

  return (
    <div className='missionCard'>

      <h3>Visitar 5 museos</h3>

      <div className='progressBar'>
        <div className='progress'></div>
      </div>

      <p>3/5 completado</p>

    </div>
  )
}

export default MissionCard
>>>>>>> 88d0f8af3f1a9b88cb94f9e872a42dc7929d9327
