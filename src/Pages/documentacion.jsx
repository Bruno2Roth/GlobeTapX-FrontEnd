import { useSession } from "../context/SessionContext";
import DocumentacionPais from "../Componentes/DocumentacionPais/DocumentacionPais";
import "../Styles/documentacion.css";

function currentCountryId(user) {
  return user?.paisActual ?? user?.PaisActual ?? user?.paisID ?? user?.PaisID ?? "";
}

export default function Documentacion() {
  const { user } = useSession();
  const countryId = currentCountryId(user);

  return (
    <main className="documentation-page">
      <div className="documentation-page__header">
        <p className="documentation-page__eyebrow">GlobeTapX</p>
        <h1>Documentación por país</h1>
        <p>Información útil del país actual de tu perfil.</p>
      </div>
      <DocumentacionPais paisId={countryId} />
    </main>
  );
}
