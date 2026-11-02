
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../Styles/explorar.css";
import { getLugaresCercanos } from "../services/backendApi";

const UBICACION_INICIAL = {
  lat: -34.6037,
  lon: -58.3816,
};

function MoverMapa({ centro }) {
  const mapa = useMap();

  useEffect(() => {
    mapa.flyTo([centro.lat, centro.lon], 15);
  }, [centro, mapa]);

  return null;
}

function Explorar() {
  const [ubicacion, setUbicacion] = useState(UBICACION_INICIAL);
  const [categoria, setCategoria] = useState("cafeterias");
  const [radio, setRadio] = useState(2000);
  const [lugares, setLugares] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setUbicacionObtenida(true);
      },
      () => {
        setError(
          "No pudimos obtener tu ubicación. Se utilizará Buenos Aires como ubicación inicial."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  async function buscarLugares() {
    setCargando(true);
    setError("");
    setSeleccionado(null);

    try {
      const respuesta = await getLugaresCercanos({
        lat: ubicacion.lat,
        lon: ubicacion.lon,
        radio,
        categoria,
      });

      const resultados = Array.isArray(respuesta?.lugares)
        ? respuesta.lugares
        : [];

      setLugares(resultados);

      if (resultados.length === 0) {
        setError("No encontramos lugares en esta zona.");
      }
    } catch (e) {
      console.error("Error al buscar lugares:", e);
      setError(
        e.message || "No se pudieron cargar los lugares. Intentá nuevamente."
      );
      setLugares([]);
    } finally {
      setCargando(false);
    }
  }

  function usarMiUbicacion() {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setUbicacionObtenida(true);
        setError("");
      },
      () => {
        setError("No se pudo obtener tu ubicación.");
      }
    );
  }

  return (
    <main className="explorar-page">
      <header className="explorar-header">
        <span className="explorar-etiqueta">GLOBETAPX EXPLORER</span>
        <h1>Explorar mapa</h1>
        <p>
          Encontrá lugares cercanos y descubrí cómo llegar a ellos.
        </p>
      </header>

      <section className="explorar-controles">
        <div className="explorar-campo">
          <label htmlFor="categoria-lugares">¿Qué estás buscando?</label>

          <select
            id="categoria-lugares"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="cafeterias">Cafeterías</option>
            <option value="restaurantes">Restaurantes</option>
            <option value="farmacias">Farmacias</option>
            <option value="hospitales">Hospitales y clínicas</option>
            <option value="supermercados">Supermercados</option>
            <option value="cajeros">Cajeros automáticos</option>
          </select>
        </div>

        <div className="explorar-campo">
          <label htmlFor="radio-lugares">Distancia máxima</label>

          <select
            id="radio-lugares"
            value={radio}
            onChange={(e) => setRadio(Number(e.target.value))}
          >
            <option value={500}>500 metros</option>
            <option value={1000}>1 kilómetro</option>
            <option value={2000}>2 kilómetros</option>
            <option value={5000}>5 kilómetros</option>
          </select>
        </div>

        <button
          className="explorar-boton"
          onClick={buscarLugares}
          disabled={cargando}
        >
          {cargando ? "Buscando..." : "Buscar lugares"}
        </button>

        <button
          className="explorar-boton-secundario"
          onClick={usarMiUbicacion}
        >
          Mi ubicación
        </button>
      </section>

      {!ubicacionObtenida && (
        <p className="explorar-aviso">
          Si no permitís la ubicación, el mapa comienza en Buenos Aires.
        </p>
      )}

      <section className="explorar-layout">
        <div className="explorar-mapa">
          <MapContainer
            center={[ubicacion.lat, ubicacion.lon]}
            zoom={14}
            scrollWheelZoom={true}
            className="mapa-leaflet"
          >
            <MoverMapa centro={ubicacion} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CircleMarker
              center={[ubicacion.lat, ubicacion.lon]}
              radius={9}
              pathOptions={{
                color: "#ffffff",
                fillColor: "#168b70",
                fillOpacity: 1,
                weight: 3,
              }}
            >
              <Popup>Tu ubicación</Popup>
            </CircleMarker>

            {lugares.map((lugar) => (
              <CircleMarker
                key={`${lugar.id}`}
                center={[lugar.lat, lugar.lon]}
                radius={8}
                pathOptions={{
                  color: "#ffffff",
                  fillColor: "#e28b37",
                  fillOpacity: 1,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSeleccionado(lugar),
                }}
              >
                <Popup>
                  <strong>{lugar.nombre}</strong>
                  <br />
                  {lugar.distanciaMetros} metros
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <aside className="explorar-resultados">
          <h2>Lugares encontrados</h2>

          {error && <p className="explorar-mensaje">{error}</p>}

          {lugares.length === 0 && !cargando && (
            <p className="explorar-vacio">
              Elegí una categoría y presioná Buscar lugares.
            </p>
          )}

          {lugares.map((lugar) => (
            <button
              key={lugar.id}
              className={`lugar-card ${
                seleccionado?.id === lugar.id ? "lugar-card-activo" : ""
              }`}
              onClick={() => {
                setSeleccionado(lugar);
                setUbicacion({
                  lat: lugar.lat,
                  lon: lugar.lon,
                });
              }}
            >
              <strong>{lugar.nombre}</strong>
              <span>{lugar.tipo}</span>
              <small>
                A {lugar.distanciaMetros} metros de tu ubicación
              </small>
            </button>
          ))}

          {seleccionado && (
            <div className="lugar-detalle">
              <h3>{seleccionado.nombre}</h3>

              {seleccionado.direccion && (
                <p>{seleccionado.direccion}</p>
              )}

              {seleccionado.telefono && (
                <p>Teléfono: {seleccionado.telefono}</p>
              )}

              {seleccionado.horario && (
                <p>Horario: {seleccionado.horario}</p>
              )}

              {seleccionado.sitioWeb && (
                <a
                  href={seleccionado.sitioWeb}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visitar sitio web
                </a>
              )}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default Explorar;
