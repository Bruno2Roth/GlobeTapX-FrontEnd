import { useCallback, useEffect, useState } from "react";
import "../Styles/horario.css";
import "../index.css";
import { getPaises } from "../services/backendApi";
import { useSession } from "../context/SessionContext";

const TIME_ZONES = {
  Argentina: "America/Argentina/Buenos_Aires",
  España: "Europe/Madrid",
  Italia: "Europe/Rome",
  Francia: "Europe/Paris",
  Inglaterra: "Europe/London",
  Brasil: "America/Sao_Paulo",
  Chile: "America/Santiago",
  Australia: "Australia/Sydney",
  China: "Asia/Shanghai",
  "Corea del Sur": "Asia/Seoul",
  Israel: "Asia/Jerusalem",
  "Estados Unidos": "America/New_York",
};

const TIME_DIFFERENCES = {
  "Europe/Madrid": 5,
  "Europe/Rome": 5,
  "Europe/Paris": 5,
  "Europe/London": 4,
  "America/Sao_Paulo": 0,
  "America/Santiago": 0,
  "America/New_York": -1,
  "Asia/Shanghai": 11,
  "Asia/Seoul": 12,
  "Asia/Jerusalem": 5,
  "Australia/Sydney": 13,
};

function Horario() {
  const { user } = useSession();
  const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  const [paisActual, setPaisActual] = useState("");
  const [horaActual, setHoraActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [horaArgentina, setHoraArgentina] = useState("");
  const [diferencia, setDiferencia] = useState("");
  const [loading, setLoading] = useState(true);

  const actualizarHora = useCallback((pais) => {
    if (!pais) return;
    const ahora = new Date();
    setFechaActual(ahora.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }));

    const argentina = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(ahora);
    setHoraArgentina(argentina);

    const zone = TIME_ZONES[pais] || "UTC";
    const hora = new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: zone,
    }).format(ahora);
    setHoraActual(hora);

    const diff = TIME_DIFFERENCES[zone] || 0;
    setDiferencia(
      diff === 0 ? "Misma hora que Argentina" : `${Math.abs(diff)} horas ${diff > 0 ? "más" : "menos"}`,
    );
  }, []);

  useEffect(() => {
    let active = true;
    if (!userCountryId) {
      setPaisActual("");
      setHoraActual("");
      setFechaActual("");
      setHoraArgentina("");
      setDiferencia("");
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const cargar = async () => {
      try {
        const paises = await getPaises();
        const pais = paises.find((item) => String(item.ID) === String(userCountryId));
        if (!active) return;
        const nombre = pais?.nombre || "";
        setPaisActual(nombre);
        actualizarHora(nombre);
      } catch (error) {
        if (active) console.error("No se pudo cargar el horario:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void cargar();
    return () => { active = false; };
  }, [actualizarHora, userCountryId]);

  useEffect(() => {
    const intervalo = setInterval(() => actualizarHora(paisActual), 1000);
    return () => clearInterval(intervalo);
  }, [actualizarHora, paisActual]);

  if (loading) return <div className="horario-loading">Cargando horario...</div>;

  return (
    <div className="horario">
      <section className="horario-header">
        <span className="badge">🕒 Horario Mundial</span>
        <h1>Hora actual</h1>
        <p>Consultá la hora del país donde viajás.</p>
      </section>

      <section className="hora-principal">
        <h2>{paisActual}</h2>
        <div className="hora">{horaActual}</div>
        <span>{fechaActual}</span>
      </section>

      <section className="cards">
        <div className="small-card">
          <h3>Argentina</h3>
          <p>{horaArgentina}</p>
        </div>
        <div className="small-card">
          <h3>Diferencia</h3>
          <p>{diferencia}</p>
        </div>
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
