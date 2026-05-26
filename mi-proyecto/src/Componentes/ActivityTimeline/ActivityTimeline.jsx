import './ActivityTimeline.css'

function ActivityTimeline() {

  const activities = [
    '✈ Vuelo reservado',
    '🏨 Check-in realizado',
    '🗺 Tour confirmado',
    '🍽 Reserva en restaurante'
  ]

  return (
    <div className='timeline'>

      {activities.map((activity, index) => (
        <div
          key={index}
          className='timelineItem'
        >
          {activity}
        </div>
      ))}

    </div>
  )
}

export default ActivityTimeline