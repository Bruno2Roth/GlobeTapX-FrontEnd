import './Calendar.css'

function Calendar() {

  const days = [
    1,2,3,4,5,6,7,
    8,9,10,11,12,13,14,
    15,16,17,18,19,20,21,
    22,23,24,25,26,27,28
  ]

  return (
    <div className='calendar'>

      <h3>Octubre 2025</h3>

      <div className='days'>

        {days.map((day) => (
          <div key={day}>
            {day}
          </div>
        ))}

      </div>

    </div>
  )
}

export default Calendar