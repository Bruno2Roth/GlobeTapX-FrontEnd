
import '../index.css'
import { useEffect, useState } from "react";
import "../Styles/numEmergencia.css";
import { getPais, getAllData } from "../services/backendApi";
import { obtenerCache, guardarCache } from "../helpers/cache";
import CacheTimer from "../Componentes/CacheTimer/CacheTimer";
import { useSession } from "../context/SessionContext";

function NumEmergencia() {
    const { user, userId } = useSession();

    const userCountryId =
        user?.paisActual ??
        user?.PaisActual ??
        user?.paisID ??
        user?.PaisID ??
        "";

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
                if (!userId || !userCountryId) {
                    setPais("");
                    setAmbulancia("");
                    setBomberos("");
                    setPolicia("");
                    setEmergencia("");
                    setCacheTimestamp(null);
                    return;
                }

                const cacheKey = `num_cache_${userId}_${userCountryId}`;
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

                // Buscamos directamente el país del usuario.
                // Ya no traemos la lista completa de países.
                const paisObj = await getPais(userCountryId);

                if (!active) return;

                if (!paisObj) {
                    setPais("");
                    return;
                }

                const nombrePais =
                    paisObj.nombre ||
                    paisObj.Nombre ||
                    "";

                setPais(nombrePais);

                // El backend actual solamente nos permite obtener
                // todos los datos de emergencias.
                const data = await getAllData();

                if (!active) return;

                let datos = data;

                if (
                    datos &&
                    typeof datos === "object" &&
                    !Array.isArray(datos)
                ) {
                    if (datos.data) datos = datos.data;
                    else if (datos.result) datos = datos.result;
                    else if (datos.records) datos = datos.records;
                    else if (datos.items) datos = datos.items;
                    else if (datos.response) datos = datos.response;
                }

                const entries = Array.isArray(datos)
                    ? datos
                    : datos && typeof datos === "object"
                        ? Object.values(datos)
                        : [];

                // Buscamos solamente la información que corresponde
                // al país que ya obtuvimos.
                const match = entries.find((e) => {
                    if (!e) return false;

                    const mismoCodigo =
                        String(e.code || "") ===
                        String(paisObj.codigo || "");

                    const mismoPais =
                        String(e.country || "").toLowerCase() ===
                        String(nombrePais).toLowerCase();

                    return mismoCodigo || mismoPais;
                });

                // IMPORTANTE:
                // Si no encontramos el país, no usamos otro país
                // como reemplazo.
                if (!match) {
                    setAmbulancia("");
                    setBomberos("");
                    setPolicia("");
                    setEmergencia("");
                    setCacheTimestamp(null);
                    return;
                }

                const cacheData = {
                    pais: nombrePais,

                    ambulancia: Array.isArray(match.ambulance)
                        ? match.ambulance[0]
                        : match.ambulance || "",

                    bomberos: Array.isArray(match.fire)
                        ? match.fire[0]
                        : match.fire || "",

                    policia: Array.isArray(match.police)
                        ? match.police[0]
                        : match.police || "",

                    emergencia: Array.isArray(match.dispatch)
                        ? match.dispatch[0]
                        : match.dispatch || "",
                };

                if (!active) return;

                guardarCache(cacheKey, cacheData);
                setCacheTimestamp(Date.now());

                setAmbulancia(cacheData.ambulancia);
                setBomberos(cacheData.bomberos);
                setPolicia(cacheData.policia);
                setEmergencia(cacheData.emergencia);

            } catch (error) {
                if (active) {
                    console.error(
                        "Error al obtener números de emergencia:",
                        error
                    );

                    setPais("");
                    setAmbulancia("");
                    setBomberos("");
                    setPolicia("");
                    setEmergencia("");
                    setCacheTimestamp(null);
                }
            }
        };

        void obtenerDatos();

        return () => {
            active = false;
        };
    }, [userCountryId, userId]);

    return (
        <div className="emergencia-container">

            <div className="header-card">
                <span className="badge">🚨 Asistencia</span>

                <h1>Números de Emergencia</h1>

                <p>Información importante para viajeros</p>

                {cacheTimestamp && (
                    <CacheTimer timestamp={cacheTimestamp} />
                )}
            </div>

            <div className="country-card">
                <h2>{pais || "Cargando..."}</h2>
                <p>País actual</p>
            </div>

            <div className="cards-grid">

                <a
                    href={`tel:${ambulancia}`}
                    className={`service-card ambulance ${
                        !ambulancia ? "sin-numero" : ""
                    }`}
                >
                    <div className="icon">🚑</div>

                    <div>
                        <h3>Ambulancia</h3>
                        <p>{ambulancia || "No disponible"}</p>
                    </div>

                    <span className="call-indicator">📞</span>
                </a>

                <a
                    href={`tel:${bomberos}`}
                    className={`service-card fire ${
                        !bomberos ? "sin-numero" : ""
                    }`}
                >
                    <div className="icon">🚒</div>

                    <div>
                        <h3>Bomberos</h3>
                        <p>{bomberos || "No disponible"}</p>
                    </div>

                    <span className="call-indicator">📞</span>
                </a>

                <a
                    href={`tel:${policia}`}
                    className={`service-card police ${
                        !policia ? "sin-numero" : ""
                    }`}
                >
                    <div className="icon">🚓</div>

                    <div>
                        <h3>Policía</h3>
                        <p>{policia || "No disponible"}</p>
                    </div>

                    <span className="call-indicator">📞</span>
                </a>

                <a
                    href={`tel:${emergencia}`}
                    className={`service-card emergency ${
                        !emergencia ? "sin-numero" : ""
                    }`}
                >
                    <div className="icon">📞</div>

                    <div>
                        <h3>Emergencias</h3>
                        <p>{emergencia || "No disponible"}</p>
                    </div>

                    <span className="call-indicator">📞</span>
                </a>

            </div>

        </div>
    );
}

export default NumEmergencia;
