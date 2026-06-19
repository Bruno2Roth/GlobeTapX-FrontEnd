import { useEffect, useState } from 'react'
import '../index.css'
import { agenda as agendaUrl } from '../config'

function Agenda() {
  const [eventos, setEventos] = useState(null)

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const res = await fetch(agendaUrl)
        const data = await res.json()
        console.log('Respuesta de agenda:', data)
        const lista = Array.isArray(data) ? data : data.eventos || data.data || data.agenda || []
        setEventos(lista)
      } catch (err) {
        console.error('Error al traer la agenda:', err)
        setEventos([])
      }
    }
    fetchAgenda()
  }, [])

  if (eventos === null) {
    return (
      <div className="agenda">
        <p className="cargando">Cargando agenda...</p>
      </div>
    )
  }

  return (
    <div className="agenda">

      <div className="header-card">
        <span className="badge">📅 Agenda</span>
        <h1>Mi Agenda</h1>
        <p>Organizá tus viajes</p>
      </div>

      <div className="lista-eventos">
        {Array.isArray(eventos) && eventos.length > 0 ? (
          eventos.map((ev, i) => (
            <div key={i} className="evento-card">
              <h3>{ev.titulo || ev.nombre || "Evento"}</h3>
              <p>{ev.descripcion || ev.fecha || ""}</p>
            </div>
          ))
        ) : (
          <p className="sin-eventos">No hay eventos en tu agenda</p>
        )}
      </div>

    </div>
  )
}

export default Agenda
