import { useState, useEffect, useCallback } from "react";
import "../Styles/cambio.css";
import '../index.css'

const monedas = [
  { code: "USD", name: "Dólar Estadounidense", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "BRL", name: "Real Brasileño", flag: "🇧🇷" },
  { code: "GBP", name: "Libra Esterlina", flag: "🇬🇧" },
  { code: "CLP", name: "Peso Chileno", flag: "🇨🇱" },
  { code: "CNY", name: "Yuan Chino", flag: "🇨🇳" },
  { code: "KRW", name: "Won Surcoreano", flag: "🇰🇷" },
  { code: "JPY", name: "Yen Japonés", flag: "🇯🇵" },
  { code: "MXN", name: "Peso Mexicano", flag: "🇲🇽" },
  { code: "COP", name: "Peso Colombiano", flag: "🇨🇴" },
  { code: "PEN", name: "Sol Peruano", flag: "🇵🇪" },
  { code: "AUD", name: "Dólar Australiano", flag: "🇦🇺" },
  { code: "CAD", name: "Dólar Canadiense", flag: "🇨🇦" },
  { code: "CHF", name: "Franco Suizo", flag: "🇨🇭" },
  { code: "ILS", name: "Shekel Israeli", flag: "🇮🇱" },
];

function Cambio() {
  const [monto, setMonto] = useState(1);
  const [origen, setOrigen] = useState("USD");
  const [destino, setDestino] = useState("ARS");
  const [resultado, setResultado] = useState(null);
  const [tasa, setTasa] = useState(null);
  const [cargando, setCargando] = useState(false);

  const convertir = useCallback(async () => {
    if (!monto || monto <= 0) return;
    setCargando(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${origen}`);
      const data = await res.json();
      if (data.result === "success") {
        const rate = data.rates[destino];
        setTasa(rate);
        setResultado((monto * rate).toFixed(2));
      }
    } catch {
      console.error("Error al obtener cotización");
    } finally {
      setCargando(false);
    }
  }, [monto, origen, destino]);

  useEffect(() => {
    convertir();
  }, [convertir]);

  const intercambiar = () => {
    setOrigen(destino);
    setDestino(origen);
  };

  return (
    <div className="cambio-container">
      <div className="cambio-hero">
        <span className="cambio-badge">💱 Conversor</span>
        <h1>Cambio de Moneda</h1>
        <p>Convertí valores entre distintas monedas del mundo al instante.</p>
      </div>

      <div className="cambio-card">
        <div className="cambio-section">
          <label className="cambio-label">Monto</label>
          <input
            type="number"
            className="cambio-monto"
            value={monto}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 8) setMonto(val);
            }}
            min="0"
            step="any"
          />
        </div>

        <div className="cambio-pares">
          <div className="cambio-select-group">
            <label className="cambio-label">De</label>
            <select value={origen} onChange={(e) => setOrigen(e.target.value)} className="cambio-select">
              {monedas.map((m) => (
                <option key={m.code} value={m.code}>{m.flag} {m.code} — {m.name}</option>
              ))}
            </select>
          </div>

          <button className="cambio-swap" onClick={intercambiar} aria-label="Intercambiar monedas">⇄</button>

          <div className="cambio-select-group">
            <label className="cambio-label">A</label>
            <select value={destino} onChange={(e) => setDestino(e.target.value)} className="cambio-select">
              {monedas.map((m) => (
                <option key={m.code} value={m.code}>{m.flag} {m.code} — {m.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="cambio-resultado">
          {cargando ? (
            <span className="cambio-cargando">Calculando...</span>
          ) : resultado !== null ? (
            <>
              <span className="cambio-resultado-monto">{resultado}</span>
              <span className="cambio-resultado-code">{destino}</span>
            </>
          ) : (
            <span className="cambio-resultado-placeholder">0.00</span>
          )}
        </div>

        {tasa && (
          <div className="cambio-tasa">
            1 {origen} = {tasa} {destino}
          </div>
        )}
      </div>

      <div className="cambio-footer">
        <p>Datos provistos por <strong>ExchangeRate-API</strong></p>
      </div>
    </div>
  );
}

export default Cambio;
