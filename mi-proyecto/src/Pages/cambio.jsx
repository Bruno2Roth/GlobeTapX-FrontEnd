import React, { useState, useEffect } from "react";
import "../index.css";

const Cambio = () => {
  const [pais, setPais] = useState("Argentina");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarPais(pais);
  }, []);

  const buscarPais = async (nombrePais) => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://A-PHZ2-CIDI-17:3000/api/clima/country?country=Argentina`
      );

      const data = await response.json();

      setInfo(data[0]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarPais(pais);
  };

  return (
    <div className="cambio-page">

      <header className="home-header">
        <div className="icon-menu">☰</div>
        <h2 className="brand-logo">GlobeTapX</h2>

        <div className="user-avatar">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="user"
          />
        </div>
      </header>

      <h1 className="cambio-title">
        Cambio de moneda
      </h1>

      <form onSubmit={handleSubmit} className="cambio-search">

        <input
          type="text"
          placeholder="Buscar país..."
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        />

        <button type="submit">
          Buscar
        </button>

      </form>

      {loading ? (
        <div className="cambio-loading">
          Cargando...
        </div>
      ) : (
        info && (
          <>
            <div className="currency-card">

              <img
                src={info.flags.png}
                alt={info.name.common}
              />

              <h2>{info.name.common}</h2>

              <p>{info.capital?.[0]}</p>

            </div>

            <div className="currency-info">

              <div className="info-box">
                <span>Región</span>
                <strong>{info.region}</strong>
              </div>

              <div className="info-box">
                <span>Población</span>
                <strong>
                  {info.population.toLocaleString()}
                </strong>
              </div>

            </div>

            <div className="currency-card-big">

              <h3>Moneda utilizada</h3>

              {Object.entries(info.currencies).map(
                ([codigo, moneda]) => (
                  <div
                    key={codigo}
                    className="currency-row"
                  >
                    <span>{codigo}</span>

                    <div>
                      <p>{moneda.name}</p>
                      <small>{moneda.symbol}</small>
                    </div>
                  </div>
                )
              )}

            </div>
          </>
        )
      )}
    </div>
  );
};

export default Cambio;