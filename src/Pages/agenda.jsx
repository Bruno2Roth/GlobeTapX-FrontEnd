import { useEffect, useState } from "react";
import {
  CalendarDays,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import "../Styles/agenda.css";
import "../index.css";
import { getAgendaUsuario, getPaises, translateText } from "../services/backendApi";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";
import { useSession } from "../context/SessionContext";

const cap = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);
const CACHE_KEY = (userId, countryId) => `agenda_${userId}_${countryId || "sin-pais"}`;

function Agenda() {
  const { user, userId } = useSession();
  const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  const initialCache = userId ? obtenerCache(CACHE_KEY(userId, userCountryId)) : null;
  const [items, setItems] = useState(() => initialCache?.data || { eventos: [], feriados: [] });
  const [fecha, setFecha] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [cacheTimestamp, setCacheTimestamp] = useState(() => initialCache?.timestamp || null);

  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();

  useEffect(() => {
    let active = true;
    if (!userId) {
      setItems({ eventos: [], feriados: [] });
      setCacheTimestamp(null);
      setSelectedDay(null);
      return () => { active = false; };
    }

    const cache = obtenerCache(CACHE_KEY(userId, userCountryId));

    if (cache) {
      setItems(cache.data || { eventos: [], feriados: [] });
      setCacheTimestamp(cache.timestamp || null);
      setSelectedDay(null);
      return () => { active = false; };
    }

    setItems({ eventos: [], feriados: [] });
    setCacheTimestamp(null);
    setSelectedDay(null);

    const fetchData = async () => {
      try {
        const [data, paises] = await Promise.all([
          getAgendaUsuario(),
          getPaises(),
        ]);
        if (!active) return;

        const userPais = paises.find((pais) => String(pais.ID) === String(userCountryId));
        let codigoPais = "AR";

        if (userPais) {
          try {
            const [tradRes, dispRes] = await Promise.all([
              translateText({
                text: userPais.nombre,
                targetLanguage: "en",
              }).catch(() => null),
              fetch("https://date.nager.at/api/v3/AvailableCountries"),
            ]);
            if (tradRes && dispRes.ok) {
              const nombreEN = tradRes.data.translatedText;
              const disponibles = await dispRes.json();
              const match = disponibles.find((pais) => pais.name === nombreEN);

              if (match) codigoPais = match.countryCode;
            }
          } catch {
            console.warn("No fue posible determinar el país para los feriados.");
          }
        }

        const eventos = (data.agenda || []).map((evento) => ({
          fecha: (evento.fechaInicio || "").split("T")[0],
          titulo: evento.eventoNombre || "Evento",
          desc: evento.eventoDescripcion || "",
          lugar: evento.ubicacion || "",
        }));

        const feriados = [];

        if (data.feriados) {
          Object.values(data.feriados).forEach((lista) => {
            if (Array.isArray(lista)) {
              lista.forEach((feriado) => {
                feriados.push({
                  fecha: feriado.date,
                  titulo: feriado.localName || feriado.name,
                });
              });
            }
          });
        }

        const anios = [];
        for (let year = 2024; year <= 2030; year += 1) anios.push(year);

        const controlador = new AbortController();
        setTimeout(() => controlador.abort(), 5000);

        const resultados = await Promise.allSettled(
          anios.map((year) =>
            fetch(
              `https://date.nager.at/api/v3/PublicHolidays/${year}/${codigoPais}`,
              { signal: controlador.signal }
            )
              .then((response) => (response.ok ? response.json() : []))
              .catch(() => [])
          )
        );

        resultados.forEach((resultado) => {
          if (resultado.status === "fulfilled" && Array.isArray(resultado.value)) {
            resultado.value.forEach((feriado) => {
              if (!feriados.some((existente) => existente.fecha === feriado.date)) {
                feriados.push({
                  fecha: feriado.date,
                  titulo: feriado.localName || feriado.name,
                });
              }
            });
          }
        });

        const result = { eventos, feriados };

        if (!active) return;
        guardarCache(CACHE_KEY(userId, userCountryId), result);
        setItems(result);
        setCacheTimestamp(Date.now());
      } catch (error) {
        if (active) console.error("Error al cargar agenda:", error);
      }
    };

    void fetchData();
    return () => { active = false; };
  }, [userCountryId, userId]);

  const normalizarFecha = (valor) => (valor || "").split("T")[0];
  const prefijo = `${anio}-${String(mes + 1).padStart(2, "0")}`;

  const enMes = (valor) => normalizarFecha(valor).startsWith(prefijo);
  const enDia = (valor, dia) =>
    normalizarFecha(valor) === `${prefijo}-${String(dia).padStart(2, "0")}`;

  const eventosMes = items.eventos.filter((evento) => enMes(evento.fecha));
  const feriadosMes = items.feriados.filter((feriado) => enMes(feriado.fecha));

  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const inicio = new Date(anio, mes, 1).getDay();
  const hoy = new Date();

  const esHoy = (dia) =>
    dia === hoy.getDate() &&
    mes === hoy.getMonth() &&
    anio === hoy.getFullYear();

  const fmtMes = (indice) =>
    cap(
      new Date(anio, indice, 1).toLocaleDateString("es-ES", {
        month: "long",
      })
    );

  const fmtDia = (indice) =>
    cap(
      new Date(2024, 0, indice + 1)
        .toLocaleDateString("es-ES", { weekday: "short" })
        .slice(0, 3)
    );

  const diasHeader = Array.from({ length: 7 }, (_, indice) => fmtDia(indice));

  const handleDayClick = (dia) => {
    const eventos = items.eventos.filter((evento) => enDia(evento.fecha, dia));
    const feriados = items.feriados.filter((feriado) => enDia(feriado.fecha, dia));

    if (!eventos.length && !feriados.length) return;

    setSelectedDay({
      dia,
      eventos,
      feriados,
      fecha: `${dia} de ${fmtMes(mes)} de ${anio}`,
    });
  };

  const cerrarModal = () => setSelectedDay(null);

  const celdas = [];

  for (let indice = 0; indice < inicio; indice += 1) {
    celdas.push(<div key={`empty-${indice}`} className="cd cd-empty" />);
  }

  Array.from({ length: diasEnMes }, (_, indice) => indice + 1).forEach((dia) => {
    const eventos = items.eventos.filter((evento) => enDia(evento.fecha, dia));
    const feriados = items.feriados.filter((feriado) => enDia(feriado.fecha, dia));
    const tieneContenido = eventos.length > 0 || feriados.length > 0;

    const clases = ["cd"];

    if (esHoy(dia)) clases.push("hoy");
    if (feriados.length) clases.push("feriado");
    if (eventos.length) clases.push("evento");
    if (selectedDay?.dia === dia) clases.push("selected");

    celdas.push(
      <button
        key={dia}
        type="button"
        className={clases.join(" ")}
        onClick={() => handleDayClick(dia)}
        disabled={!tieneContenido}
        aria-label={
          tieneContenido
            ? `Ver actividades del ${dia} de ${fmtMes(mes)}`
            : `${dia} de ${fmtMes(mes)}`
        }
      >
        <span className="num">{dia}</span>

        <span className="tags">
          {feriados.slice(0, 1).map((feriado, indice) => (
            <span
              key={`feriado-${indice}`}
              className="tag f-tag"
              title={feriado.titulo}
            >
              {feriado.titulo}
            </span>
          ))}

          {eventos.slice(0, 1).map((evento, indice) => (
            <span
              key={`evento-${indice}`}
              className="tag e-tag"
              title={evento.titulo}
            >
              {evento.titulo}
            </span>
          ))}

          {feriados.length + eventos.length > 1 && (
            <span className="tag tag-more">
              +{feriados.length + eventos.length - 1}
            </span>
          )}
        </span>
      </button>
    );
  });

  return (
    <main className="agenda">
      <section className="h-card">
        <div className="h-card-content">
          <span className="badge">
            <CalendarDays size={14} />
            Agenda
          </span>

          <h1>Mi agenda</h1>
          <p>Organizá tus viajes, eventos y días importantes.</p>

          {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
        </div>

        <div className="agenda-hero-icon">
          <CalendarDays size={42} strokeWidth={1.5} />
        </div>
      </section>

      <section className="cal">
        <div className="cal-h">
          <button
            className="btn"
            type="button"
            onClick={() => setFecha(new Date(anio, mes - 1, 1))}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={21} />
          </button>

          <div>
            <span className="cal-eyebrow">Calendario</span>
            <h3>
              {fmtMes(mes)} <span className="anio">{anio}</span>
            </h3>
          </div>

          <button
            className="btn"
            type="button"
            onClick={() => setFecha(new Date(anio, mes + 1, 1))}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={21} />
          </button>
        </div>

        <div className="cal-dias">
          {diasHeader.map((dia) => (
            <span key={dia} className="dl">
              {dia}
            </span>
          ))}
        </div>

        <div
          className="cal-grid"
          style={{ gridTemplateRows: "repeat(6, 52px)" }}
        >
          {celdas}
        </div>
      </section>

      {eventosMes.length === 0 && feriadosMes.length === 0 && (
        <section className="vacio">
          <div className="empty-icon">
            <CalendarX size={25} />
          </div>
          <h3>Sin actividades</h3>
          <p>No hay eventos ni feriados para este mes.</p>
        </section>
      )}

      {(eventosMes.length > 0 || feriadosMes.length > 0) && (
        <section className="lista-eventos">
          <div className="lista-header">
            <span>Este mes</span>
            <h2>Próximas actividades</h2>
          </div>

          {feriadosMes.map((feriado, indice) => (
            <article className="item-feriado" key={`feriado-${indice}`}>
              <div className="list-icon">
                <CalendarDays size={18} />
              </div>
              <span>{feriado.titulo}</span>
            </article>
          ))}

          {eventosMes.map((evento, indice) => (
            <article className="item-evento" key={`evento-${indice}`}>
              <div className="list-icon">
                <CalendarDays size={18} />
              </div>

              <div>
                <strong>{evento.titulo}</strong>
                {evento.desc && <p>{evento.desc}</p>}

                {evento.lugar && (
                  <small>
                    <MapPin size={13} />
                    {evento.lugar}
                  </small>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedDay && (
        <div
          className="dm-overlay"
          onClick={cerrarModal}
          role="presentation"
        >
          <section
            className="dm-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Actividades del ${selectedDay.fecha}`}
          >
            <div className="dm-h">
              <div>
                <span className="dm-label">Actividades del día</span>
                <span className="dm-fecha">{selectedDay.fecha}</span>
              </div>

              <button
                className="dm-x"
                type="button"
                onClick={cerrarModal}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="dm-body">
              {selectedDay.feriados.map((feriado, indice) => (
                <div key={`modal-feriado-${indice}`} className="dm-feriado">
                  <CalendarDays size={17} />
                  <span>{feriado.titulo}</span>
                </div>
              ))}

              {selectedDay.eventos.map((evento, indice) => (
                <div key={`modal-evento-${indice}`} className="dm-evento">
                  <CalendarDays size={18} className="dm-evento-icon" />

                  <div>
                    <div className="dm-evento-titulo">{evento.titulo}</div>

                    {evento.desc && (
                      <div className="dm-evento-desc">{evento.desc}</div>
                    )}

                    {evento.lugar && (
                      <div className="dm-evento-lugar">
                        <MapPin size={13} />
                        {evento.lugar}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Agenda;
