import { useSession } from "../context/SessionContext";
import ProblemasVidaDiaria from "../Componentes/ProblemasVidaDiaria/ProblemasVidaDiaria";
import "../Styles/documentacion.css";

function currentCountryId(user) {
  return user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
}

export default function VidaDiaria() {
  const { user } = useSession();
  const countryId = currentCountryId(user);

  return (
    <main className="documentation-page">
      <div className="documentation-page__header">
        <p className="documentation-page__eyebrow">GlobeTapX</p>
        <h1>Vida diaria</h1>
        <p>Problemas frecuentes del país actual de tu perfil.</p>
      </div>
      <ProblemasVidaDiaria paisId={countryId} />
    </main>
  );
}
