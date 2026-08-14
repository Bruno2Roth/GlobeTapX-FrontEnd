import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  CircleDollarSign,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";
import "../Styles/cambio.css";
import "../index.css";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const monedas = [
  { code: "USD", name: "Dólar estadounidense" },
  { code: "EUR", name: "Euro" },
  { code: "ARS", name: "Peso argentino" },
  { code: "BRL", name: "Real brasileño" },
  { code: "GBP", name: "Libra esterlina" },
  { code: "CLP", name: "Peso chileno" },
  { code: "CNY", name: "Yuan chino" },
  { code: "KRW", name: "Won surcoreano" },
  { code: "JPY", name: "Yen japonés" },
  { code: "MXN", name: "Peso mexicano" },
  { code: "COP", name: "Peso colombiano" },
  { code: "PEN", name: "Sol peruano" },
  { code: "AUD", name: "Dólar australiano" },
  { code: "CAD", name: "Dólar canadiense" },
  { code: "CHF", name: "Franco suizo" },
  { code: "ILS", name: "Shekel israelí" },
];

function Cambio() {
  const [monto, setMonto] = useState(1);
  const [origen, setOrigen] = useState("USD");
  const [destino, setDestino] = useState("ARS");
  const [resultado, setResultado] = useState(null);
  const [tasa, setTasa] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const convertir = useCallback(async () => {
    if (!monto || Number(monto) <= 0) {
      setResultado(null);
      setTasa(null);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${origen}`);
      const data = await res.json();

      if (data.result !== "success" || !data.rates[destino]) {
        throw new Error("Cotización no disponible");
      }

      const rate = data.rates[destino];
      setTasa(rate);
      setResultado((Number(monto) * rate).toFixed(2));
    } catch (err) {
      console.error("Error al obtener cotización:", err);
      setError(CONNECTION_ERROR_MESSAGE);
      setResultado(null);
      setTasa(null);
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
    <main className="cambio-container">
      <section className="cambio-hero">
        <div className="cambio-hero-content">
          <span className="cambio-badge">
            <ChartNoAxesCombined size={14} />
            Conversor
          </span>

          <h1>Cambio de moneda</h1>
          <p>Consultá conversiones entre monedas internacionales.</p>
        </div>

        <div className="cambio-hero-icon">
          <BadgeDollarSign size={45} strokeWidth={1.5} />
        </div>
      </section>

      <section className="cambio-card">
        <div className="cambio-section">
          <label className="cambio-label" htmlFor="cambio-monto">
            Monto a convertir
          </label>

          <div className="cambio-input-wrap">
            <CircleDollarSign size={20} />
            <input
              id="cambio-monto"
              type="number"
              className="cambio-monto"
              value={monto}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 8) setMonto(val);
              }}
              min="0"
              step="any"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="cambio-pares">
          <div className="cambio-select-group">
            <label className="cambio-label" htmlFor="moneda-origen">
              Desde
            </label>

            <select
              id="moneda-origen"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className="cambio-select"
            >
              {monedas.map((moneda) => (
                <option key={moneda.code} value={moneda.code}>
                  {moneda.code} · {moneda.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="cambio-swap"
            type="button"
            onClick={intercambiar}
            aria-label="Intercambiar monedas"
            title="Intercambiar monedas"
          >
            <ArrowLeftRight size={19} />
          </button>

          <div className="cambio-select-group">
            <label className="cambio-label" htmlFor="moneda-destino">
              Hacia
            </label>

            <select
              id="moneda-destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="cambio-select"
            >
              {monedas.map((moneda) => (
                <option key={moneda.code} value={moneda.code}>
                  {moneda.code} · {moneda.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="cambio-resultado" aria-live="polite">
          <span className="resultado-label">Recibís aproximadamente</span>

          {cargando ? (
            <span className="cambio-cargando">
              <LoaderCircle size={19} />
              Calculando cotización
            </span>
          ) : resultado !== null ? (
            <div className="resultado-valor">
              <span className="cambio-resultado-monto">{resultado}</span>
              <span className="cambio-resultado-code">{destino}</span>
            </div>
          ) : (
            <span className="cambio-resultado-placeholder">0.00</span>
          )}
        </section>

        {error && <p className="cambio-error">{error}</p>}

        {tasa && !error && (
          <div className="cambio-tasa">
            <TrendingUp size={15} />
            <span>
              1 {origen} equivale a {tasa.toFixed(4)} {destino}
            </span>
          </div>
        )}
      </section>

      <footer className="cambio-footer">
        <p>
          Cotizaciones provistas por <strong>ExchangeRate-API</strong>
        </p>
      </footer>
    </main>
  );
}

export default Cambio;
