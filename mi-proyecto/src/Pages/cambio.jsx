import React, { useState } from "react";
import "../Styles/cambio.css";
import { API } from "../config";


function Cambio() {
  const [monto, setMonto] = useState(1);
  const [origen, setOrigen] = useState("USD");
  const [destino, setDestino] = useState("EUR");

  const [resultado, setResultado] = useState("");
  const [cotizacion, setCotizacion] = useState("");

  const convertir = async () => {
    try {
      const response = await fetch(API);

      const data = await response.json();

      console.log(data);

      setResultado(data.resultado);
      setCotizacion(data.cotizacion);
    } catch (error) {
      console.log(error);
    }
  };

  const intercambiarMonedas = () => {
    const monedaOrigen = origen;

    setOrigen(destino);
    setDestino(monedaOrigen);
  };

  return (
    <div className="cambio-container">

      <div className="cambio-title-card">
        <span className="badge">💱 Conversor</span>

        <h2>Cambio de Moneda</h2>

        <p>Convertí valores entre distintas monedas del mundo.</p>
      </div>

      <div className="cambio-card">

        <div className="moneda-box">

          <span>Moneda origen</span>

          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />

          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
          >
            <option value="ARS">Peso Argentino (ARS)</option>
            <option value="AUD">Dólar Australiano (AUD)</option>
            <option value="USD">Dólar Estadounidense (USD)</option>
            <option value="BRL">Real Brasileño (BRL)</option>
            <option value="GBP">Libra Esterlina (GBP)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="ILS">Shekel Israelí (ILS)</option>
            <option value="KRW">Won Surcoreano (KRW)</option>
            <option value="CNY">Yuan Chino (CNY)</option>
            <option value="CLP">Peso Chileno (CLP)</option>
          </select>

        </div>

        <button
          className="swap-btn"
          onClick={intercambiarMonedas}
        >
          ⇅
        </button>

        <div className="moneda-box">

          <span>Moneda destino</span>

          <div className="resultado-box">
            {resultado || "0.00"}
          </div>

          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          >
            <option value="ARS">Peso Argentino (ARS)</option>
            <option value="AUD">Dólar Australiano (AUD)</option>
            <option value="USD">Dólar Estadounidense (USD)</option>
            <option value="BRL">Real Brasileño (BRL)</option>
            <option value="GBP">Libra Esterlina (GBP)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="ILS">Shekel Israelí (ILS)</option>
            <option value="KRW">Won Surcoreano (KRW)</option>
            <option value="CNY">Yuan Chino (CNY)</option>
            <option value="CLP">Peso Chileno (CLP)</option>
          </select>

        </div>

      </div>

      <div className="cotizacion-card">

        <p>Cotización actual</p>

        <h3>
          1 {origen} = {cotizacion || "-"} {destino}
        </h3>

      </div>

      <button
        className="convertir-btn"
        onClick={convertir}
      >
        Convertir Moneda
      </button>

    </div>
  );
}

export default Cambio;