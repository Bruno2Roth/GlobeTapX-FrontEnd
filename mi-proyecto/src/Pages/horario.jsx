import { useEffect, useState } from "react";
import "../Styles/horario.css";
import "../index.css";
import api from "../services/api";
import HoraCard from "../Components/HoraCard";
import DiferenciaHoraria from "../Components/DiferenciaHoraria";
import SelectorPais from "../Components/SelectorPais";

function Horario() {

  const userId = localStorage.getItem("userId");

  const [usuario, setUsuario] = useState(null);

  const [paisActual, setPaisActual] = useState("");

  const [horaActual, setHoraActual] = useState("");

  const [fechaActual, setFechaActual] = useState("");

  const [horaArgentina, setHoraArgentina] = useState("");

  const [diferencia, setDiferencia] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    cargar();

  }, []);

  useEffect(() => {

    const intervalo = setInterval(() => {

      actualizarHora();

    },1000);

    return ()=>clearInterval(intervalo);

  },[paisActual]);

  const cargar = async()=>{

    try{

      const user = await api.get(`/usuario/${userId}`);

      const paises = await api.get("/pais");

      setUsuario(user.data);

      const pais = paises.data.find(

        p=>p.ID===user.data.paisActual

      );

      if(pais){

        setPaisActual(pais.nombre);

      }

      actualizarHora(pais?.nombre);

    }

    finally{

      setLoading(false);

    }

  };

  const actualizarHora = (pais=paisActual)=>{

    if(!pais) return;

    const ahora = new Date();

    setFechaActual(

      ahora.toLocaleDateString("es-AR",{

        weekday:"long",

        day:"numeric",

        month:"long"

      })

    );

    const argentina = new Intl.DateTimeFormat("es-AR",{

      hour:"2-digit",

      minute:"2-digit",

      second:"2-digit",

      timeZone:"America/Argentina/Buenos_Aires"

    }).format(ahora);

    setHoraArgentina(argentina);

    const mapa={

      Argentina:"America/Argentina/Buenos_Aires",

      España:"Europe/Madrid",

      Italia:"Europe/Rome",

      Francia:"Europe/Paris",

      Inglaterra:"Europe/London",

      Brasil:"America/Sao_Paulo",

      Chile:"America/Santiago",

      Australia:"Australia/Sydney",

      China:"Asia/Shanghai",

      "Corea del Sur":"Asia/Seoul",

      Israel:"Asia/Jerusalem",

      "Estados Unidos":"America/New_York"

    };

    const zona=mapa[pais]||"UTC";

    const hora=new Intl.DateTimeFormat("es-AR",{

      hour:"2-digit",

      minute:"2-digit",

      second:"2-digit",

      timeZone:zona

    }).format(ahora);

    setHoraActual(hora);

    const utc=new Date().getTimezoneOffset()/60;

    let diff=0;

    switch(zona){

      case "Europe/Madrid": diff=5; break;
      case "Europe/Rome": diff=5; break;
      case "Europe/Paris": diff=5; break;
      case "Europe/London": diff=4; break;
      case "America/Sao_Paulo": diff=0; break;
      case "America/Santiago": diff=0; break;
      case "America/New_York": diff=-1; break;
      case "Asia/Shanghai": diff=11; break;
      case "Asia/Seoul": diff=12; break;
      case "Asia/Jerusalem": diff=5; break;
      case "Australia/Sydney": diff=13; break;
      default: diff=0;

    }

    if(diff===0){

      setDiferencia("Misma hora que Argentina");

    }else if(diff>0){

      setDiferencia(`${diff} horas más`);

    }else{

      setDiferencia(`${Math.abs(diff)} horas menos`);

    }

  };

  if(loading){

    return(

      <div className="horario-loading">

        Cargando horario...

      </div>

    );

  }

  return(

    <div className="horario">

      <section className="horario-header">

        <span className="badge">

          🕒 Horario Mundial

        </span>

        <h1>

          Hora actual

        </h1>

        <p>

          Consultá la hora del país donde viajás.

        </p>

      </section>

      <section className="hora-principal">

        <h2>

          {paisActual}

        </h2>

        <div className="hora">

          {horaActual}

        </div>

        <span>

          {fechaActual}

        </span>

      </section>

      <section className="cards">

        <div className="small-card">

          <h3>

            Argentina

          </h3>

          <p>

            {horaArgentina}

          </p>

        </div>

        <div className="small-card">

          <h3>

            Diferencia

          </h3>

          <p>

            {diferencia}

          </p>

        </div>

      </section>

      <section className="info">

        <div className="info-card">

          <h3>

            Consejo

          </h3>

          <p>

            Si viajás a un país con diferencia horaria importante, intentá adaptar tus horarios de sueño unos días antes del viaje para reducir el jet lag.

          </p>

        </div>

      </section>

    </div>

  );

}

export default Horario;