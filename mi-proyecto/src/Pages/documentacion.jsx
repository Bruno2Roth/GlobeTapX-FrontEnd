import { useEffect, useState } from "react";
import { getUsuario } from "../config";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import DocumentacionPais from "../Componentes/DocumentacionPais/DocumentacionPais";
import Loader from "../Componentes/Loader/Loader";
import "../Styles/documentacion.css";

function currentCountryId(user) {
  return user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
}

export default function Documentacion() {
  const userId = localStorage.getItem("userId");
  const [countryId, setCountryId] = useState("");
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState(userId ? "" : "No se encontró el usuario actual.");

  useEffect(() => {
    let active = true;

    if (!userId) {
      return undefined;
    }

    getUsuario(userId)
      .then((user) => {
        if (active) setCountryId(currentCountryId(user));
      })
      .catch(() => {
        if (active) setError(CONNECTION_ERROR_MESSAGE);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <main className="documentation-page">
      <div className="documentation-page__header">
        <p className="documentation-page__eyebrow">GlobeTapX</p>
        <h1>Documentación por país</h1>
        <p>Información útil del país actual de tu perfil.</p>
      </div>

      {error ? (
        <p className="documentation-page__error">{error}</p>
      ) : (
        <DocumentacionPais paisId={countryId} />
      )}
    </main>
  );
}
