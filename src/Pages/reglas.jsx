import { useState } from "react";
import "../index.css";
import "../Styles/reglas.css";
import reglasPaises from "../data/reglasPaises";

function Reglas() {
  const [paisSeleccionado, setPaisSeleccionado] = useState("Argentina");

  const pais = reglasPaises[paisSeleccionado];

  return (
    <main className="reglas-page">

      {/* HEADER DE LA PÁGINA */}
      <section className="reglas-intro">
        <span className="reglas-badge">
          🌎 Información de viaje
        </span>

        <h1>Reglas de viaje</h1>

        <p>
          Consultá las principales reglas y recomendaciones
          del país que vas a visitar.
        </p>
      </section>


      {/* SELECTOR */}
      <section className="selector-pais">

        <label htmlFor="pais">
          Seleccioná tu destino
        </label>

        <div className="select-wrapper">

          <span className="select-icon">
            {pais.bandera}
          </span>

          <select
            id="pais"
            value={paisSeleccionado}
            onChange={(e) => setPaisSeleccionado(e.target.value)}
          >
            {Object.keys(reglasPaises).map((nombre) => (
              <option
                key={nombre}
                value={nombre}
              >
                {reglasPaises[nombre].bandera} {nombre}
              </option>
            ))}
          </select>

          <span className="select-arrow">
            ▼
          </span>

        </div>

      </section>


      {/* PAÍS SELECCIONADO */}
      <section className="pais-card">

        <div className="pais-card-header">

          <div className="pais-flag">
            {pais.bandera}
          </div>

          <div className="pais-info">
            <h2>{paisSeleccionado}</h2>

            <p>
              Información para viajeros
            </p>
          </div>

        </div>


        {/* DOCUMENTACIÓN */}
        <Regla
          icon="🪪"
          titulo="Documentación"
          items={pais.documentos}
        />


        {/* ENTRADA */}
        <Regla
          icon="🛂"
          titulo="Entrada al país"
          items={pais.entrada}
        />


        {/* ADUANA */}
        <Regla
          icon="🧳"
          titulo="Aduana"
          items={pais.aduana}
        />


        {/* COMPORTAMIENTO */}
        <Regla
          icon="⚠️"
          titulo="Comportamiento"
          items={pais.comportamiento}
        />


        {/* CONSEJOS */}
        <Regla
          icon="💡"
          titulo="Consejos"
          items={pais.consejos}
        />

      </section>


      {/* AVISO */}
      <section className="reglas-aviso">

        <div className="aviso-icon">
          ⚠️
        </div>

        <div>
          <h3>Importante</h3>

          <p>
            Las reglas de entrada, documentación y aduana
            pueden cambiar. Verificá siempre los requisitos
            oficiales antes de viajar.
          </p>
        </div>

      </section>

    </main>
  );
}


/* COMPONENTE PARA CADA SECCIÓN */

function Regla({ icon, titulo, items }) {
  return (
    <section className="regla-seccion">

      <div className="regla-header">

        <span className="regla-icon">
          {icon}
        </span>

        <h3>
          {titulo}
        </h3>

      </div>

      <ul className="regla-lista">

        {items.map((item, index) => (
          <li key={index}>
            <span className="check">
              ✓
            </span>

            <span>
              {item}
            </span>
          </li>
        ))}

      </ul>

    </section>
  );
}

export default Reglas;