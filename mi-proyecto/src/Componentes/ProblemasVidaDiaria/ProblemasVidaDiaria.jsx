import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getCountryDocumentation } from "../../services/countryDocumentationService";
import { CONNECTION_ERROR_MESSAGE } from "../../helpers/errorMessages";
import Loader from "../Loader/Loader";
import "./index.css";

function parseProblems(value) {
  if (typeof value !== "string") return [];
  return value.split(/\r?\n/).map((item) => item.trim().replace(/^•\s*/, "").trim()).filter(Boolean);
}

function errorMessage() {
  return CONNECTION_ERROR_MESSAGE;
}

export default function ProblemasVidaDiaria({ paisId }) {
  const [data, setData] = useState(null);
  const [requestState, setRequestState] = useState({ paisId: null, status: "empty", error: "" });
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (paisId === undefined || paisId === null || paisId === "") return undefined;
    const controller = new AbortController();
    getCountryDocumentation(paisId, { signal: controller.signal })
      .then((result) => {
        if (!result || !result.paisNombre) {
          setRequestState({ paisId: String(paisId), status: "not-found", error: "El país no fue encontrado." });
          return;
        }
        setData(result);
        setImageFailed(false);
        setRequestState({ paisId: String(paisId), status: "loaded", error: "" });
      })
      .catch((requestError) => {
        if (requestError?.code === "ERR_CANCELED" || requestError?.name === "CanceledError") return;
        const status = (requestError?.response?.status ?? requestError?.status) === 404 ? "not-found" : "error";
        setRequestState({ paisId: String(paisId), status, error: errorMessage(requestError) });
      });
    return () => controller.abort();
  }, [paisId]);

  if (paisId === undefined || paisId === null || paisId === "") return <p className="daily-problems__state">No hay un país actual configurado en tu perfil.</p>;
  if (requestState.paisId !== String(paisId)) return <Loader />;
  if (requestState.status === "not-found" || requestState.status === "error") return <p className="daily-problems__state daily-problems__state--error">{requestState.error}</p>;
  if (!data) return <Loader />;

  const problems = parseProblems(data.vidaDiaria);
  const hasImage = typeof data.imagen === "string" && data.imagen.trim() && !imageFailed;

  return (
    <article className="daily-problems" aria-live="polite">
      <div className="daily-problems__image-wrap">
        {hasImage ? <img src={data.imagen} alt={data.paisNombre} onError={() => setImageFailed(true)} /> : <div className="daily-problems__image-placeholder" role="img" aria-label={`Sin imagen de ${data.paisNombre}`}><span aria-hidden="true">🌐</span><span>Imagen no disponible</span></div>}
      </div>
      <div className="daily-problems__body">
        <p className="daily-problems__eyebrow">Vida diaria</p>
        <h2>{data.paisNombre}</h2>
        <h3>Problemas De La Vida Diaria</h3>
        {problems.length ? <ul>{problems.map((problem, index) => <li key={`${problem}-${index}`}><AlertTriangle size={17} strokeWidth={1.8} aria-hidden="true" /><span>{problem}</span></li>)}</ul> : <p className="daily-problems__empty">No hay información de problemas de la vida diaria para este país.</p>}
      </div>
    </article>
  );
}

