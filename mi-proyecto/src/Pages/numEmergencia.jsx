import { useEffect, useState } from "react";
import "../Styles/numEmergencia.css";
import { API } from "../config";

function NumEmergencia() {
    const [pais, setPais] = useState("");
    const [ambulancia, setAmbulancia] = useState("");
    const [bomberos, setBomberos] = useState("");
    const [policia, setPolicia] = useState("");
    const [emergencia, setEmergencia] = useState("");

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const respuesta = await fetch( `http://${HOST}:${PORT}/api`);

                if (!respuesta.ok) {
                    throw new Error("Error al obtener los datos");
                }

                const data = await respuesta.json();

                console.log(data);

                setPais(data.pais || data.nombre || "");
                setAmbulancia(data.ambulancia || "");
                setBomberos(data.bomberos || "");
                setPolicia(data.policia || "");
                setEmergencia(data.emergencia || "");

            } catch (error) {
                console.error("Error:", error);
            }
        };

        obtenerDatos();
    }, []);

    return (
        <div className="emergencia-container">

            <div className="header-card">
                <span className="badge">🚨 Asistencia</span>
                <h1>Números de Emergencia</h1>
                <p>Información importante para viajeros</p>
            </div>

            <div className="country-card">
                <h2>{pais}</h2>
                <p>Servicios disponibles</p>
            </div>

            <div className="cards-grid">

                <div className="service-card ambulance">
                    <div className="icon">🚑</div>
                    <div>
                        <h3>Ambulancia</h3>
                        <p>{ambulancia}</p>
                    </div>
                </div>

                <div className="service-card fire">
                    <div className="icon">🚒</div>
                    <div>
                        <h3>Bomberos</h3>
                        <p>{bomberos}</p>
                    </div>
                </div>

                <div className="service-card police">
                    <div className="icon">🚓</div>
                    <div>
                        <h3>Policía</h3>
                        <p>{policia}</p>
                    </div>
                </div>

                <div className="service-card emergency">
                    <div className="icon">📞</div>
                    <div>
                        <h3>Emergencias</h3>
                        <p>{emergencia}</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default NumEmergencia;