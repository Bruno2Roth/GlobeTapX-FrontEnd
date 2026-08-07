import { useEffect, useState } from "react";
import { getCountryDocumentation } from "../../services/countryDocumentationService";
import Loader from "../Loader/Loader";
import "./index.css";

const EMPTY_DOCUMENTATION = "La documentación de este país aún no está disponible.";

function errorMessage(error) {
  switch (error?.response?.status ?? error?.status) {
    case 400:
      return "El país seleccionado no es válido.";
    case 404:
      return "No se encontró información para este país.";
    case 500:
      return "El servidor no pudo cargar la documentación. Intentá nuevamente.";
    default:
      return "No se pudo conectar con el servicio de documentación.";
  }
}

function looksLikeHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function sanitizeHtml(value) {
  if (typeof window === "undefined") return "";

  const documentFragment = new DOMParser().parseFromString(value, "text/html");
  const allowedTags = new Set([
    "A", "B", "BR", "CODE", "EM", "H2", "H3", "H4", "I", "LI", "OL", "P", "PRE", "STRONG", "UL",
  ]);
  const allowedAttributes = new Set(["href", "title", "target", "rel"]);

  documentFragment.body.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      if (!allowedAttributes.has(attribute.name.toLowerCase())) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === "A") {
      const href = element.getAttribute("href") || "";
      if (!/^(https?:|mailto:|#)/i.test(href)) element.removeAttribute("href");
      if (element.getAttribute("target") === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
      }
    }
  });

  return documentFragment.body.innerHTML;
}

function ImagePlaceholder({ name }) {
  return (
    <div className="country-documentation__image-placeholder" role="img" aria-label={`Sin imagen de ${name || "país"}`}>
      <span aria-hidden="true">🌐</span>
      <span>Imagen no disponible</span>
    </div>
  );
}

export default function DocumentacionPais({ paisId }) {
  const [data, setData] = useState(null);
  const [requestState, setRequestState] = useState({ paisId: null, status: "empty", error: "" });
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (paisId === undefined || paisId === null || paisId === "") {
      return undefined;
    }

    const controller = new AbortController();
    getCountryDocumentation(paisId, { signal: controller.signal })
      .then((result) => {
        if (!result || !result.paisNombre) {
          setRequestState({ paisId: String(paisId), status: "not-found", error: "No se encontró información para este país." });
          return;
        }
        setImageFailed(false);
        setData(result);
        setRequestState({ paisId: String(paisId), status: "loaded", error: "" });
      })
      .catch((requestError) => {
        if (requestError?.code === "ERR_CANCELED" || requestError?.name === "CanceledError") return;
        const status = (requestError?.response?.status ?? requestError?.status) === 404 ? "not-found" : "error";
        setRequestState({ paisId: String(paisId), status, error: errorMessage(requestError) });
      });

    return () => controller.abort();
  }, [paisId]);

  if (paisId === undefined || paisId === null || paisId === "") {
    return <p className="country-documentation__state">Seleccioná un país para ver su documentación.</p>;
  }

  if (requestState.paisId !== String(paisId)) return <Loader />;

  if (requestState.status === "not-found") {
    return <p className="country-documentation__state country-documentation__state--error">{requestState.error}</p>;
  }

  if (requestState.status === "error") {
    return <p className="country-documentation__state country-documentation__state--error">{requestState.error}</p>;
  }

  if (!data) return <Loader />;

  const hasImage = typeof data.imagen === "string" && data.imagen.trim() && !imageFailed;
  const hasDocumentation = typeof data.documentacion === "string" && data.documentacion.trim();
  const documentationIsHtml = hasDocumentation && looksLikeHtml(data.documentacion);
  const sanitizedDocumentation = documentationIsHtml
    ? sanitizeHtml(data.documentacion)
    : "";

  return (
    <article className="country-documentation" aria-live="polite">
      <div className="country-documentation__image-wrap">
        {hasImage ? (
          <img
            className="country-documentation__image"
            src={data.imagen}
            alt={data.paisNombre}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImagePlaceholder name={data.paisNombre} />
        )}
      </div>

      <div className="country-documentation__body">
        <h2>{data.paisNombre}</h2>
        <div className={`country-documentation__content${hasDocumentation ? "" : " country-documentation__content--empty"}`}>
          {hasDocumentation ? (
            documentationIsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizedDocumentation }} />
            ) : (
              <p className="country-documentation__plain-text">{data.documentacion}</p>
            )
          ) : (
            <p>{EMPTY_DOCUMENTATION}</p>
          )}
        </div>
      </div>
    </article>
  );
}
