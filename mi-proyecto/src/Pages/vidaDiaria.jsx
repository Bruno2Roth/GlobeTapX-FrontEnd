import { useEffect, useState } from "react";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { getCachedUserProfile, refreshUserProfile } from "../services/userProfileService";
import ProblemasVidaDiaria from "../Componentes/ProblemasVidaDiaria/ProblemasVidaDiaria";
import Loader from "../Componentes/Loader/Loader";
import "../Styles/documentacion.css";

function currentCountryId(user) {
  return user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
}

export default function VidaDiaria() {
  const userId = localStorage.getItem("userId");
  const cachedCountryId = currentCountryId(getCachedUserProfile(userId));
  const [countryId, setCountryId] = useState(cachedCountryId);
  const [loading, setLoading] = useState(Boolean(userId && !cachedCountryId));
  const [error, setError] = useState(userId ? "" : "No se encontró el usuario actual.");

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    refreshUserProfile(userId)
      .then((user) => { if (active) setCountryId(currentCountryId(user)); })
      .catch(() => { if (active && !cachedCountryId) setError(CONNECTION_ERROR_MESSAGE); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, cachedCountryId]);

  if (loading) return <Loader />;
  return (
    <main className="documentation-page">
      <div className="documentation-page__header">
        <p className="documentation-page__eyebrow">GlobeTapX</p>
        <h1>Vida diaria</h1>
        <p>Problemas frecuentes del país actual de tu perfil.</p>
      </div>
      {error ? <p className="documentation-page__error">{error}</p> : <ProblemasVidaDiaria paisId={countryId} />}
    </main>
  );
}

