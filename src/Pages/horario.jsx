import { useEffect, useMemo, useState } from "react";
import "../Styles/horario.css";
import "../index.css";
import { getPaises } from "../services/backendApi";
import { useSession } from "../context/SessionContext";
import HoraCard from "../Componentes/HoraCard";
import DiferenciaHoraria from "../Componentes/DiferenciaHoraria";
import SelectorPais from "../Componentes/SelectorPais";
import {
  formatClock,
  formatClockDate,
  getTimeDifferenceLabel,
  getTimeZoneForCountry,
} from "../helpers/worldClock";

function Horario() {
  const { user } = useSession();
  const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  const [paises, setPaises] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState("");
  const [ahora, setAhora] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPaises()
      .then((countries) => {
        if (!active) return;
        setPaises(countries);
        const selected = countries.find(
          (country) => String(country.ID) === String(userCountryId),
        );
        setPaisSeleccionado(selected?.nombre || countries[0]?.nombre || "Argentina");
      })
      .catch((error) => {
        if (active) console.error("No se pudieron cargar los países:", error);
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [userCountryId]);

  useEffect(() => {
    const intervalId = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const opcionesPais = useMemo(
    () => paises.map((country) => country.nombre).filter(Boolean),
    [paises],
  );
  const pais = paises.find((country) => country.nombre === paisSeleccionado);
  const timeZone = getTimeZoneForCountry(pais);
  const fecha = formatClockDate(ahora, timeZone);
  const hora = formatClock(ahora, timeZone);
  const horaArgentina = formatClock(ahora, "America/Argentina/Buenos_Aires");
  const diferencia = getTimeDifferenceLabel(ahora, timeZone);

  if (loading) return <div className="horario-loading">Cargando horario...</div>;

  return (
    <div className="horario">
      <section className="horario-header">
        <span className="badge">🕒 Horario Mundial</span>
        <h1>Hora actual</h1>
        <p>Consultá la hora local de un país y comparala con Argentina.</p>
      </section>

      <SelectorPais
        paises={opcionesPais}
        paisSeleccionado={paisSeleccionado}
        cambiarPais={setPaisSeleccionado}
      />

      <HoraCard pais={paisSeleccionado || "País"} hora={hora} fecha={fecha} />

      <section className="cards horario-comparacion" aria-label="Comparación horaria">
        <HoraCard
          pais="Argentina"
          hora={horaArgentina}
          fecha={formatClockDate(ahora, "America/Argentina/Buenos_Aires")}
          icono="🇦🇷"
        />
        <DiferenciaHoraria diferencia={diferencia} />
      </section>

      <section className="info">
        <div className="info-card">
          <h3>Consejo</h3>
          <p>Si viajás a un país con diferencia horaria importante, intentá adaptar tus horarios de sueño unos días antes del viaje para reducir el jet lag.</p>
        </div>
      </section>
    </div>
  );
}

export default Horario;
