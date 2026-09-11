import '../index.css'
import { useEffect, useState } from "react";
import "../Styles/numEmergencia.css";
import { getPaises, getAllData } from "../services/backendApi";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";
import { useSession } from "../context/SessionContext";

function NumEmergencia() {
    const { user, userId } = useSession();
    const userCountryId = user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
    const [pais, setPais] = useState("");
    const [ambulancia, setAmbulancia] = useState("");
    const [bomberos, setBomberos] = useState("");
    const [policia, setPolicia] = useState("");
    const [emergencia, setEmergencia] = useState("");
  const [cacheTimestamp, setCacheTimestamp] = useState(null);

  useEffect(() => {
    let active = true;
    const obtenerDatos = async () => {
            try {
                if (!userId) {
                    setPais("");
                    setAmbulancia("");
                    setBomberos("");
                    setPolicia("");
                    setEmergencia("");
                    setCacheTimestamp(null);
                    return;
                }

                const cacheKey = `num_cache_${userId}_${userCountryId || "sin-pais"}`;
                const cache = obtenerCache(cacheKey, 60000);
                if (cache) {
                    if (!active) return;
                    setPais(cache.data.pais || "");
                    setAmbulancia(cache.data.ambulancia || "");
                    setBomberos(cache.data.bomberos || "");
                    setPolicia(cache.data.policia || "");
                    setEmergencia(cache.data.emergencia || "");
                    setCacheTimestamp(cache.timestamp);
                    return;
                }

                setPais("");
                setAmbulancia("");
                setBomberos("");
                setPolicia("");
                setEmergencia("");
                setCacheTimestamp(null);

                const paises = await getPaises();
                if (!active) return;
                const paisObj = paises.find((p) => String(p.ID) === String(userCountryId));

                if (paisObj) setPais(paisObj.nombre || "");

                let data = await getAllData();
                if (!active) return;

                if (data && typeof data === "object" && !Array.isArray(data)) {
                    if (data.data) data = data.data;
                    else if (data.result) data = data.result;
                    else if (data.records) data = data.records;
                    else if (data.items) data = data.items;
                    else if (data.response) data = data.response;
                }

                const entries = Array.isArray(data)
                    ? data
                    : data && typeof data === "object"
                        ? Object.values(data)
                        : [];

                const match = entries.find(e =>
                    e && (e.code === paisObj?.codigo || e.country === paisObj?.nombre)
                ) || (entries.length > 0 ? entries[0] : null);

                const cacheData = {
                    pais: paisObj?.nombre || "",
                    ambulancia: Array.isArray(match?.ambulance) ? match.ambulance[0] : match?.ambulance || "",
                    bomberos: Array.isArray(match?.fire) ? match.fire[0] : match?.fire || "",
                    policia: Array.isArray(match?.police) ? match.police[0] : match?.police || "",
                    emergencia: Array.isArray(match?.dispatch) ? match.dispatch[0] : match?.dispatch || "",
                };

                if (!active) return;
                guardarCache(cacheKey, cacheData);
                setCacheTimestamp(Date.now());

                if (paisObj) setPais(paisObj.nombre || "");
                if (match) {
                    setAmbulancia(cacheData.ambulancia);
                    setBomberos(cacheData.bomberos);
                    setPolicia(cacheData.policia);
                    setEmergencia(cacheData.emergencia);
                }
            } catch (error) {
                if (active) console.error(error);
            }
        };
        void obtenerDatos();
        return () => { active = false; };
    }, [userCountryId, userId]);

    return (
        <div className="emergencia-container">

            <div className="header-card">
                <span className="badge">🚨 Asistencia</span>
                <h1>Números de Emergencia</h1>
                <p>Información importante para viajeros</p>
                {cacheTimestamp && <CacheTimer timestamp={cacheTimestamp} />}
            </div>

            <div className="country-card">
                <h2>{pais || "Cargando..."}</h2>
                <p>País actual</p>
            </div>

            <div className="cards-grid">

                <a href={`tel:${ambulancia}`} className={`service-card ambulance ${!ambulancia ? "sin-numero" : ""}`}>
                    <div className="icon">🚑</div>
                    <div>
                        <h3>Ambulancia</h3>
                        <p>{ambulancia}</p>
                    </div>
                    <span className="call-indicator">📞</span>
                </a>

                <a href={`tel:${bomberos}`} className={`service-card fire ${!bomberos ? "sin-numero" : ""}`}>
                    <div className="icon">🚒</div>
                    <div>
                        <h3>Bomberos</h3>
                        <p>{bomberos}</p>
                    </div>
                    <span className="call-indicator">📞</span>
                </a>

                <a href={`tel:${policia}`} className={`service-card police ${!policia ? "sin-numero" : ""}`}>
                    <div className="icon">🚓</div>
                    <div>
                        <h3>Policía</h3>
                        <p>{policia}</p>
                    </div>
                    <span className="call-indicator">📞</span>
                </a>

                <a href={`tel:${emergencia}`} className={`service-card emergency ${!emergencia ? "sin-numero" : ""}`}>
                    <div className="icon">📞</div>
                    <div>
                        <h3>Emergencias</h3>
                        <p>{emergencia}</p>
                    </div>
                    <span className="call-indicator">📞</span>
                </a>

            </div>

        </div>
    );
}

export default NumEmergencia;
