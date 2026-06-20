import { useEffect, useState } from 'react'
import '../index.css'
import { agenda as agendaUrl, usuarioURL, paisesURL, TRADUCTOR_URL } from '../config'

const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

function Agenda() {
  const [items, setItems] = useState({ eventos: [], feriados: [] })
  const [fecha, setFecha] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaRes, userRes, paisesRes] = await Promise.all([
          fetch(agendaUrl),
          fetch(usuarioURL),
          fetch(paisesURL)
        ])
        const data = await agendaRes.json()
        const userData = await userRes.json()
        const paises = await paisesRes.json()

        const userPais = paises.find(p => p.ID === userData.paisActual)
        let codigoPais = 'AR'
        if (userPais) {
          try {
            const [tradRes, dispRes] = await Promise.all([
              fetch(`${TRADUCTOR_URL}?q=${encodeURIComponent(userPais.nombre)}&langpair=es|en`),
              fetch('https://date.nager.at/api/v3/AvailableCountries')
            ])
            if (tradRes.ok && dispRes.ok) {
              const tradData = await tradRes.json()
              const nombreEN = tradData.responseData.translatedText
              const disp = await dispRes.json()
              const match = disp.find(p => p.name === nombreEN)
              if (match) codigoPais = match.countryCode
            }
          } catch {}
        }

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
        const anios = []
        for (let y = 2024; y <= 2030; y++) anios.push(y)
        const controlador = new AbortController()
        setTimeout(() => controlador.abort(), 5000)
        const resultados = await Promise.allSettled(
          anios.map(y =>
            fetch(`https://date.nager.at/api/v3/PublicHolidays/${y}/${codigoPais}`, { signal: controlador.signal })
              .then(r => r.ok ? r.json() : [])
              .catch(() => [])
          )
        )
        resultados.forEach(r => {
          if (r.status === 'fulfilled' && Array.isArray(r.value)) {
            r.value.forEach(f => {
              if (!feriados.some(ex => ex.fecha === f.date))
                feriados.push({ fecha: f.date, titulo: f.localName || f.name })
            })
          }
        })
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
  for (let i = 0; i < inicio; i++) celdas.push(<div key={`e${i}`} className="cd cd-empty" />)
  for (let d = 1; d <= diasEnMes; d++) {
    const evs = items.eventos.filter(e => enDia(e.fecha, d))
    const fers = items.feriados.filter(e => enDia(e.fecha, d))
    const cls = ['cd']
    if (esHoy(d)) cls.push('hoy')
    if (fers.length) cls.push('feriado')
    if (evs.length) cls.push('evento')
    celdas.push(
      <div key={d} className={cls.join(' ')} onClick={() => handleDayClick(d)}>
        <span className="num">{d}</span>
        <div className="tags">
          {fers.map((f, i) => <span key={`f${i}`} className="tag f-tag" title={f.titulo}>{f.titulo}</span>)}
          {evs.slice(0, 2).map((e, i) => <span key={`e${i}`} className="tag e-tag" title={`${e.titulo}${e.desc ? ' - ' + e.desc : ''}`}>{e.titulo}</span>)}
          {evs.length > 2 && <span className="tag e-tag tag-more">+{evs.length - 2} más</span>}
        </div>
      </div>
    )
  }
  while (celdas.length < 42) celdas.push(<div key={`v${celdas.length}`} className="cd cd-empty" />)

  const fmtMes = (i) => cap(new Date(anio, i, 1).toLocaleDateString('es-ES', { month: 'long' }))
  const fmtDia = (i) => cap(new Date(2024, 0, i + 1).toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 3))
  const diasHeader = Array.from({ length: 7 }, (_, i) => fmtDia(i))

  const handleDayClick = (d) => {
    const evs = items.eventos.filter(e => enDia(e.fecha, d))
    const fers = items.feriados.filter(e => enDia(e.fecha, d))
    if (evs.length > 0 || fers.length > 0) {
      setSelectedDay({
        dia: d,
        eventos: evs,
        feriados: fers,
        fecha: `${d} de ${fmtMes(mes)} de ${anio}`
      })
    }
  }

  const cerrarModal = () => setSelectedDay(null)

  return (
    <div className="agenda">
      <div className="h-card">
        <span className="badge">📅 Agenda</span>
        <h1>Mi Agenda</h1>
        <p>Organizá tus viajes</p>
      </div>

      <div className="cal">
        <div className="cal-h">
          <button className="btn" onClick={() => setFecha(new Date(anio, mes - 1, 1))} aria-label="Mes anterior">‹</button>
          <h3>{fmtMes(mes)} <span className="anio">{anio}</span></h3>
          <button className="btn" onClick={() => setFecha(new Date(anio, mes + 1, 1))} aria-label="Mes siguiente">›</button>
        </div>
        <div className="cal-dias">
          {diasHeader.map(d => <span key={d} className="dl">{d}</span>)}
        </div>
        <div className="cal-grid">{celdas}</div>
      </div>

      {eventosMes.length === 0 && feriadosMes.length === 0 && (
        <div className="vacio">📭 No hay eventos ni feriados este mes</div>
      )}
      {selectedDay && (
        <div className="dm-overlay" onClick={cerrarModal}>
          <div className="dm-modal" onClick={e => e.stopPropagation()}>
            <div className="dm-h">
              <span className="dm-fecha">{selectedDay.fecha}</span>
              <button className="dm-x" onClick={cerrarModal}>✕</button>
            </div>
            <div className="dm-body">
              {selectedDay.feriados.map((f, i) => (
                <div key={`mf${i}`} className="dm-feriado">📅 {f.titulo}</div>
              ))}
              {selectedDay.eventos.map((e, i) => (
                <div key={`me${i}`} className="dm-evento">
                  <div className="dm-evento-titulo">{e.titulo}</div>
                  {e.desc && <div className="dm-evento-desc">{e.desc}</div>}
                  {e.lugar && <div className="dm-evento-lugar">📍 {e.lugar}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agenda
