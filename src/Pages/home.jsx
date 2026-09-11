import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/home.css";
import '../index.css'
import { getPais } from "../services/backendApi";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";
import { localizeCountryName } from "../helpers/translatePage";
import { useSession } from "../context/SessionContext";

const REVALIDATION_MIN_MS = 45 * 1000;
const REVALIDATION_MAX_MS = 75 * 1000;

function calcularHoraGMT(gmt) {
  if (gmt == null) return "";
  let offset = 0;
  if (typeof gmt === "number") {
    offset = gmt;
  } else if (typeof gmt === "string") {
    const m = gmt.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (m) {
      offset = parseFloat(m[2]) + (m[3] ? parseFloat(m[3]) / 60 : 0);
      if (m[1] === "-") offset = -offset;
    } else {
      const m2 = gmt.match(/(?:UTC|GMT)([+-]\d{1,2})/);
      if (m2) offset = parseFloat(m2[1]);
    }
  }
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utc + offset * 3600000)
    .toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function Home() {
  const { user, userId } = useSession();
  const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
  const cacheKey = `home_cache_${userId}_${userCountryId || "sin-pais"}`;
  const initialCache = userId ? obtenerCache(cacheKey) : null;

  const [pais, setPais] = useState(() => initialCache?.data?.pais || "");
  const [paisCodigo, setPaisCodigo] = useState(() => initialCache?.data?.countryCode || "");
  const [hora, setHora] = useState(() => calcularHoraGMT(initialCache?.data?.gmt));
  const [heroImg, setHeroImg] = useState(() => initialCache?.data?.heroImg || "");
  const [cacheTimestamp, setCacheTimestamp] = useState(() => initialCache?.timestamp || null);

  useEffect(() => {
    if (!userId) return undefined;

    let active = true;
    let refreshTimer;

    const fetchData = async () => {
      try {
        if (!userCountryId) return;

        const paisData = await getPais(userCountryId);
        const gmt = paisData.gmt ?? 0;
        const heroImage = typeof paisData.imagen === "string" ? paisData.imagen.trim() : "";

        if (!active) return;

        setPais(paisData.nombre);
        setPaisCodigo(paisData.codigo || paisData.code || "");
        setHeroImg(heroImage);
        setHora(calcularHoraGMT(gmt));

        guardarCache(cacheKey, {
          pais: paisData.nombre,
          countryCode: paisData.codigo || paisData.code || "",
          heroImg: heroImage,
          gmt,
        });
        setCacheTimestamp(Date.now());
      } catch (error) {
        if (active) console.warn("No se pudo actualizar el país de la landing:", error);
      }
    };

    const scheduleRefresh = () => {
      const delay = REVALIDATION_MIN_MS
        + Math.floor(Math.random() * (REVALIDATION_MAX_MS - REVALIDATION_MIN_MS + 1));
      refreshTimer = window.setTimeout(async () => {
        await fetchData();
        if (active) scheduleRefresh();
      }, delay);
    };

    const cachedHome = obtenerCache(cacheKey);
    if (cachedHome) {
      setPais(cachedHome.data?.pais || "");
      setPaisCodigo(cachedHome.data?.countryCode || "");
      setHeroImg(cachedHome.data?.heroImg || "");
      setHora(calcularHoraGMT(cachedHome.data?.gmt));
      setCacheTimestamp(cachedHome.timestamp || null);
    } else {
      setPais("");
      setPaisCodigo("");
      setHeroImg("");
      setHora("");
      setCacheTimestamp(null);
    }
    if (!cachedHome || !cachedHome.data?.countryCode) void fetchData();
    scheduleRefresh();

    return () => {
      active = false;
      window.clearTimeout(refreshTimer);
    };
  }, [cacheKey, userCountryId, userId]);

  return (
    <div className="home">
      <div
        className="hero"
        style={
          heroImg
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${heroImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        <div className="hero-content">
          <h2 data-translate="Tu viaje global comienza aquí">Tu viaje global comienza aquí</h2>
          <input
            type="text"
            placeholder="¿A dónde vamos ahora?"
            data-translate="¿A dónde vamos ahora?"
            className="search"
          />
        </div>
      </div>

      <div className="location">
        <p className="label" data-translate="CURRENTLY EXPLORING">CURRENTLY EXPLORING</p>
        <h3 data-country-code={paisCodigo || undefined}>
          {pais ? localizeCountryName(paisCodigo, pais) : "Cargando..."}
        </h3>
        <p className="time">
          <span data-country-code={paisCodigo || undefined}>
            {pais ? localizeCountryName(paisCodigo, pais) : "..."}
          </span>
          · {hora || "..."} <span data-translate="LOCAL">LOCAL</span>
        </p>
        {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
      </div>

      <div className="cards">
        <Link to="/numEmergencia" className="card red">
          <p data-translate="Emergencias y Seguridad">Emergencias y Seguridad</p>
        </Link>
        <Link to="/vida" className="card orange">
          <p data-translate="Vida diaria">Vida diaria</p>
        </Link>
        <Link to="/cambio" className="card green">
          <p data-translate="Cambio">Cambio</p>
        </Link>
        <Link to="/documentacion" className="card blue">
          <p data-translate="Documentación">Documentación</p>
        </Link>
      </div>

      <div className="mini-buttons">
        <Link to="/clima" className="mini-btn">
          <p data-translate="Clima">Clima</p>
        </Link>
        <Link to="/idioma" className="mini-btn">
          <p data-translate="Idioma">Idioma</p>
        </Link>
        <Link to="/reglas" className="mini-btn">
          <p data-translate="Reglas">Reglas</p>
        </Link>
        <Link to="/Agenda" className="mini-btn">
          <p data-translate="Agenda">Agenda</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
