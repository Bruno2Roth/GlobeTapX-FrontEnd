import { useEffect, useState } from 'react'
import '../index.css'
import { agenda as agendaUrl } from '../config'

const meses = 'Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre'.split(',')
const diasSemana = 'Dom Lun Mar Mié Jue Vie Sáb'.split(' ')

function Agenda() {
  const [items, setItems] = useState({ eventos: [], feriados: [] })
  const [fecha, setFecha] = useState(new Date())
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(agendaUrl)
        const data = await res.json()
        const eventos = (data.agenda || []).map(e => ({
          fecha: (e.fechaInicio || '').split('T')[0],
          titulo: e.eventoNombre || 'Evento',
          desc: e.eventoDescripcion || '',
          lugar: e.ubicacion || ''
        }))
        const feriados = []
        if (data.feriados) {
          Object.values(data.feriados).forEach(arr => {
            if (Array.isArray(arr)) arr.forEach(f => {
              feriados.push({ fecha: f.date, titulo: f.localName || f.name })
            })
          })
        }
        setItems({ eventos, feriados })
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const f = (v) => (v || '').split('T')[0]
  const prefijo = `${anio}-${String(mes + 1).padStart(2, '0')}`
  const enMes = (v) => f(v).startsWith(prefijo)
  const enDia = (v, d) => f(v) === `${prefijo}-${String(d).padStart(2, '0')}`

  const eventosMes = items.eventos.filter(e => enMes(e.fecha))
  const feriadosMes = items.feriados.filter(e => enMes(e.fecha))

  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const inicio = new Date(anio, mes, 1).getDay()
  const hoy = new Date()
  const esHoy = (d) => d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()

  const celdas = []
  for (let i = 0; i < inicio; i++) celdas.push(<div key={`e${i}`} className="cd" />)
  for (let d = 1; d <= diasEnMes; d++) {
    const evs = items.eventos.filter(e => enDia(e.fecha, d))
    const fers = items.feriados.filter(e => enDia(e.fecha, d))
    const cls = ['cd']
    if (esHoy(d)) cls.push('hoy')
    if (fers.length) cls.push('feriado')
    if (evs.length) cls.push('evento')
    celdas.push(
      <div key={d} className={cls.join(' ')}>
        <span className="num">{d}</span>
        {fers.length > 0 && <span className="tag f-tag">{fers[0].titulo.substring(0, 20)}</span>}
        {evs.length > 0 && <span className="tag e-tag">{evs[0].titulo.substring(0, 20)}</span>}
        {evs.length > 1 && <span className="tag e-tag">+{evs.length - 1} más</span>}
      </div>
    )
  }

  return (
    <div className="agenda">
      <div className="h-card">
        <span className="badge">📅 Agenda</span>
        <h1>Mi Agenda</h1>
        <p>Organizá tus viajes</p>
      </div>

      <div className="cal">
        <div className="cal-h">
          <button className="btn" onClick={() => setFecha(new Date(anio, mes - 1, 1))}>‹</button>
          <h3>{meses[mes]} <span className="anio">{anio}</span></h3>
          <button className="btn" onClick={() => setFecha(new Date(anio, mes + 1, 1))}>›</button>
        </div>
        <div className="cal-dias">
          {diasSemana.map(d => <span key={d} className="dl">{d}</span>)}
        </div>
        <div className="cal-grid">{celdas}</div>
      </div>

      {eventosMes.length === 0 && feriadosMes.length === 0 && (
        <p className="vacio">No hay eventos ni feriados este mes</p>
      )}
    </div>
  )
}

export default Agenda
