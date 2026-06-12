import React, { useEffect, useState } from "react";
import "../index.css";

function NumEmergencia() {

    const [pais, setPais] = useState("");
    const [ambulancia, setAmbulancia] = useState("");
    const [bomberos, setBomberos] = useState("");
    const [policia, setPolicia] = useState("");
    const [emergencia, setEmergencia] = useState("");

    useEffect(() => {

        fetch("http://A-PHZ2-CIDI-17:3000/api/country/AR")
            .then((res) => res.json())
            .then((data) => {

                console.log(data);

                setPais(data.pais || data.nombre || "");
                setAmbulancia(data.ambulancia || "");
                setBomberos(data.bomberos || "");
                setPolicia(data.policia || "");
                setEmergencia(data.emergencia || "");

            })
            .catch((error) => console.log(error));

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