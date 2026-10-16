
import { useState } from "react";
import "../index.css";
import "../Styles/lugaresInseguros.css";
import lugaresInsegurosData from "../data/lugaresInseguros";

function LugaresInseguros() {
  const [paisSeleccionado, setPaisSeleccionado] = useState("Argentina");

  const pais = lugaresInsegurosData[paisSeleccionado];

  return (
    <main className="inseguros-page">
      <section className="inseguros-intro">
        <span className="inseguros-badge">
          🛡️ Seguridad para viajeros
        </span>

        <h1>Lugares para recorrer con precaución</h1>

        <p>
          Informate sobre zonas que requieren mayor atención
          y prepará tu viaje con recomendaciones útiles.
        </p>
      </section>

      <section className="inseguros-selector">
        <label htmlFor="pais-inseguro">Seleccioná tu destino</label>

        <select
          id="pais-inseguro"
          value={paisSeleccionado}
          onChange={(e) => setPaisSeleccionado(e.target.value)}
        >
          {Object.keys(lugaresInsegurosData).map((nombre) => (
            <option key={nombre} value={nombre}>
              {lugaresInsegurosData[nombre].bandera} {nombre}
            </option>
          ))}
        </select>
      </section>

      <section className="inseguros-resumen">
        <div className="inseguros-bandera">
          {pais.bandera}
        </div>

        <div>
          <h2>{paisSeleccionado}</h2>
          <p>{pais.resumen}</p>
        </div>
      </section>

      <section className="zonas-container">
        <div className="zonas-titulo">
          <div>
            <span className="inseguros-eyebrow">GUÍA DE DESTINO</span>
            <h2>Zonas a tener en cuenta</h2>
          </div>

          <span className="zonas-cantidad">
            {pais.zonas.length} zonas
          </span>
        </div>

        <div className="zonas-lista">
          {pais.zonas.map((zona, index) => (
            <article className="zona-card" key={`${zona.nombre}-${index}`}>
              <div className="zona-card-top">
                <div className="zona-icono">{zona.icono}</div>

                <span className={`zona-nivel ${zona.nivel}`}>
                  {zona.etiqueta}
                </span>
              </div>

              <h3>{zona.nombre}</h3>
              <p className="zona-descripcion">{zona.descripcion}</p>

              <div className="zona-riesgo">
                <strong>¿Qué tener en cuenta?</strong>
                <p>{zona.riesgo}</p>
              </div>

              <div className="zona-recomendacion">
                <span>💡</span>
                <p>{zona.recomendacion}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="consejos-seguridad">
        <div className="consejos-icono">🛡️</div>

        <div>
          <h2>Consejos para viajar con más seguridad</h2>

          <ul>
            {pais.consejos.map((consejo, index) => (
              <li key={index}>{consejo}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="inseguros-aviso">
        <span>⚠️</span>
        <div>
          <h3>Información orientativa</h3>
          <p>
            La presencia de estas zonas no significa que todo el
            barrio o lugar sea peligroso. La situación puede cambiar
            según la fecha, el horario y las condiciones locales.
            Consultá las alertas oficiales antes de viajar.
          </p>

          <a href={pais.fuente} target="_blank" rel="noreferrer">
            Consultar recomendaciones oficiales ↗
          </a>
        </div>
      </section>
    </main>
  );
}

export default LugaresInseguros;
