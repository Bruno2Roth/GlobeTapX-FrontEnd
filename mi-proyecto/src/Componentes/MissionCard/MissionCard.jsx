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