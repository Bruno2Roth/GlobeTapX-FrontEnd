import React, { useState } from "react";
import "../index.css";

function Cambio() {
  const [monto, setMonto] = useState(1);

  const [origen, setOrigen] = useState("USD");
  const [destino, setDestino] = useState("EUR");

  const [resultado, setResultado] = useState("0.92");
  const [cotizacion, setCotizacion] = useState("0.92045");

  const convertir = async () => {
    try {

      const response = await fetch(
        `http://A-PHZ2-CIDI-18:3000/api/cambio?from=${origen}&to=${destino}&amount=${monto}`
      );

      const data = await response.json();

      setResultado(data.resultado);
      setCotizacion(data.cotizacion);

    } catch (error) {
      console.log(error);
    }
  };

  const intercambiarMonedas = () => {
    const temp = origen;

    setOrigen(destino);
    setDestino(temp);
  };

  return (
    <div className="cambio-container">

      <div className="cambio-header">

        <div className="menu">☰</div>

        <h1>GlobeTapX</h1>

        <img
          src="https://i.pravatar.cc/100?img=32"
          alt="perfil"
        />

      </div>

      <div className="cambio-card">

        <div className="moneda-box">

          <span>Desde</span>

          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />

          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
          >
            <option value="ARS">Argentina - ARS</option>
            <option value="AUD">Australia - AUD</option>
            <option value="USD">Estados Unidos - USD</option>
            <option value="BRL">Brasil - BRL</option>
            <option value="GBP">Inglaterra - GBP</option>
            <option value="EUR">Francia - EUR</option>
            <option value="ILS">Israel - ILS</option>
            <option value="KRW">Corea del Sur - KRW</option>
            <option value="CNY">China - CNY</option>
            <option value="EUR">Italia - EUR</option>
            <option value="EUR">España - EUR</option>
            <option value="CLP">Chile - CLP</option>
          </select>

        </div>

        <button
          className="swap-btn"
          onClick={intercambiarMonedas}
        >
          ⇅
        </button>

        <div className="moneda-box">

          <span>Hacia</span>

          <h2>{resultado}</h2>

          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            <option value="ARS">Argentina - ARS</option>
            <option value="AUD">Australia - AUD</option>
            <option value="USD">Estados Unidos - USD</option>
            <option value="BRL">Brasil - BRL</option>
            <option value="GBP">Inglaterra - GBP</option>
            <option value="EUR">Francia - EUR</option>
            <option value="ILS">Israel - ILS</option>
            <option value="KRW">Corea del Sur - KRW</option>
            <option value="CNY">China - CNY</option>
            <option value="EUR">Italia - EUR</option>
            <option value="EUR">España - EUR</option>
            <option value="CLP">Chile - CLP</option>
          </select>

        </div>

      </div>

      <div className="cotizacion-card">

        <p>Cotización actual</p>

        <h3>
          1 {origen} = {cotizacion} {destino}
        </h3>

      </div>

      <button
        className="convertir-btn"
        onClick={convertir}
      >
        Convertir 
      </button>

    </div>
  );
}

export default Cambio;