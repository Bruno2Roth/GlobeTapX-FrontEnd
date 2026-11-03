import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/explorar.css";
import { buscarLugares, crearRecorridoIA, calcularRuta } from "../services/explorarApi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const BUENOS_AIRES = { lat: -34.6037, lon: -58.3816 };
const MODOS = [
  { value: "walking", label: "Caminar", emoji: "🚶" },
  { value: "cycling", label: "Bicicleta", emoji: "🚲" },
  { value: "driving", label: "Auto", emoji: "🚗" },
  { value: "transit", label: "Transporte público", emoji: "🚌" },
];
const CATEGORIAS = [
  ["todos", "Todos"],
  ["cafeterias", "Cafeterías"],
  ["restaurantes", "Restaurantes"],
  ["bancos", "Bancos"],
  ["farmacias", "Farmacias"],
  ["supermercados", "Supermercados"],
  ["hospitales", "Hospitales"],
  ["atracciones", "Atracciones"],
];

function MoverMapa({ centro }) {
  const map = useMap();
  useEffect(() => {
    if (centro?.lat && centro?.lon) map.flyTo([centro.lat, centro.lon], 14, { duration: 1 });
  }, [centro, map]);
  return null;
}

function FormatearDistancia({ metros }) {
  if (metros == null) return null;
  return <>{metros < 1000 ? `${Math.round(metros)} m` : `${(metros / 1000).toFixed(1)} km`}</>;
}

export default function Explorar() {
  const [ubicacion, setUbicacion] = useState(BUENOS_AIRES);
  const [lugares, setLugares] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [radio, setRadio] = useState(1500);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [modo, setModo] = useState("walking");
  const [pedidoIA, setPedidoIA] = useState("");
  const [recorrido, setRecorrido] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const puntosRuta = useMemo(() => ruta?.coordinates?.map(([lon, lat]) => [lat, lon]) || [], [ruta]);

  async function cargarLugares(pos = ubicacion) {
    setCargando(true);
    setError("");
    setMensaje("");
    try {
      const data = await buscarLugares({
        lat: pos.lat,
        lon: pos.lon,
        radio,
        categoria,
      });
      setLugares(data.lugares || []);
      setSeleccionado(null);
      setRecorrido(null);
      setRuta(null);
      if (!data.lugares?.length) setMensaje("No encontramos lugares en ese radio. Probá aumentando la distancia.");
    } catch (e) {
      setError(e.message || "No se pudieron cargar los lugares.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarLugares(ubicacion);
  }, []);

  function usarMiUbicacion() {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nueva = { lat: coords.latitude, lon: coords.longitude };
        setUbicacion(nueva);
        cargarLugares(nueva);
      },
      () => setError("No pudimos acceder a tu ubicación. Revisá los permisos del navegador."),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  async function buscarDestino(e) {
    e.preventDefault();
    if (!busqueda.trim()) return;
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(busqueda)}`);
      if (!res.ok) throw new Error("No se pudo buscar ese destino.");
      const resultados = await res.json();
      if (!resultados.length) throw new Error("No encontramos ese destino.");
      const destino = { lat: Number(resultados[0].lat), lon: Number(resultados[0].lon) };
      setUbicacion(destino);
      await cargarLugares(destino);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setCargando(false);
    }
  }

  async function generarRecorrido(e) {
    e.preventDefault();
    if (!pedidoIA.trim()) {
      setError("Escribí qué recorrido querés hacer.");
      return;
    }
    setCargando(true);
    setError("");
    setMensaje("");
    setRuta(null);
    try {
      const data = await crearRecorridoIA({
        lat: ubicacion.lat,
        lon: ubicacion.lon,
        pedido: pedidoIA,
        transporte: modo,
        lugaresDisponibles: lugares.slice(0, 35).map((p) => ({
          id: p.id,
          nombre: p.nombre,
          tipo: p.tipo,
          lat: p.lat,
          lon: p.lon,
          direccion: p.direccion,
        })),
      });
      setRecorrido(data.recorrido);
      if (data.recorrido?.paradas?.length) {
        const coords = data.recorrido.paradas.map((p) => ({ lat: p.lat, lon: p.lon }));
        const routeData = await calcularRuta({ puntos: coords, transporte: modo });
        setRuta(routeData.ruta);
      }
    } catch (e2) {
      setError(e2.message || "No se pudo generar el recorrido.");
    } finally {
      setCargando(false);
    }
  }

  async function irAlLugar(lugar) {
    setSeleccionado(lugar);
    setRecorrido(null);
    setRuta(null);
    if (modo === "transit") {
      setMensaje("El transporte público requiere cobertura GTFS/OpenTripPlanner para esta ciudad. Podés seleccionar caminar, bicicleta o auto.");
      return;
    }
    try {
      const data = await calcularRuta({
        puntos: [ubicacion, { lat: lugar.lat, lon: lugar.lon }],
        transporte: modo,
      });
      setRuta(data.ruta);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  const centro = [ubicacion.lat, ubicacion.lon];

  return (
    <main className="explorar-page">
      <header className="explorar-header">
        <div>
          <span className="explorar-eyebrow">GLOBETAPX · DESCUBRÍ TU DESTINO</span>
          <h1>Explorar mapa</h1>
          <p>Encontrá lugares, calculá cómo llegar y creá recorridos con IA.</p>
        </div>
        <button className="btn-secondary" onClick={usarMiUbicacion}>◎ Usar mi ubicación</button>
      </header>

      <section className="explorar-search-panel">
        <form className="destino-form" onSubmit={buscarDestino}>
          <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar una ciudad o destino (ej. París, Torre Eiffel)" />
          <button type="submit" disabled={cargando}>Buscar destino</button>
        </form>
        <div className="filtros-explorar">
          <label>
            Categoría
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {CATEGORIAS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Distancia
            <select value={radio} onChange={(e) => setRadio(Number(e.target.value))}>
              <option value={500}>500 metros</option>
              <option value={1000}>1 km</option>
              <option value={1500}>1,5 km</option>
              <option value={3000}>3 km</option>
              <option value={5000}>5 km</option>
              <option value={10000}>10 km</option>
            </select>
          </label>
          <button onClick={() => cargarLugares()} disabled={cargando}>Buscar lugares</button>
        </div>
      </section>

      {error && <div className="explorar-alert error">{error}</div>}
      {mensaje && <div className="explorar-alert info">{mensaje}</div>}

      <section className="explorar-layout">
        <div className="mapa-wrap">
          <MapContainer center={centro} zoom={13} scrollWheelZoom className="mapa-leaflet">
            <MoverMapa centro={ubicacion} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={centro} radius={radio} pathOptions={{ color: "#2563eb", fillOpacity: 0.05 }} />
            <Marker position={centro}>
              <Popup>Ubicación de búsqueda</Popup>
            </Marker>
            {lugares.map((l) => (
              <Marker key={l.id} position={[l.lat, l.lon]} eventHandlers={{ click: () => irAlLugar(l) }}>
                <Popup>
                  <strong>{l.nombre}</strong><br />
                  {l.tipo}<br />
                  <FormatearDistancia metros={l.distanciaMetros} />
                </Popup>
              </Marker>
            ))}
            {recorrido?.paradas?.map((p, i) => (
              <Marker key={`parada-${i}`} position={[p.lat, p.lon]}>
                <Popup>{i + 1}. {p.nombre}</Popup>
              </Marker>
            ))}
            {puntosRuta.length > 0 && <Polyline positions={puntosRuta} pathOptions={{ color: "#2563eb", weight: 5 }} />}
          </MapContainer>
          <div className="mapa-leyenda">© OpenStreetMap contributors</div>
        </div>

        <aside className="explorar-sidebar">
          <section className="panel-card">
            <div className="panel-title-row">
              <h2>Lugares encontrados</h2>
              <span className="contador-lugares">{lugares.length}</span>
            </div>
            {cargando && <p className="texto-muted">Buscando...</p>}
            {!cargando && lugares.length === 0 && <p className="texto-muted">Todavía no hay resultados. Elegí una categoría y buscá.</p>}
            <div className="lista-lugares">
              {lugares.map((l) => (
                <button key={l.id} className={`lugar-item ${seleccionado?.id === l.id ? "activo" : ""}`} onClick={() => irAlLugar(l)}>
                  <span className="lugar-icono">📍</span>
                  <span className="lugar-texto">
                    <strong>{l.nombre}</strong>
                    <small>{l.tipo} · <FormatearDistancia metros={l.distanciaMetros} /></small>
                    {l.direccion && <small>{l.direccion}</small>}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel-card">
            <h2>Cómo querés trasladarte</h2>
            <div className="modos-transporte">
              {MODOS.map((m) => (
                <button key={m.value} className={modo === m.value ? "modo-activo" : ""} onClick={() => setModo(m.value)}>
                  <span>{m.emoji}</span>{m.label}
                </button>
              ))}
            </div>
            {modo === "transit" && <p className="texto-muted">Colectivos, trenes y subtes necesitan datos de transporte público de la ciudad.</p>}
          </section>

          <section className="panel-card panel-ia">
            <div className="ia-heading"><span>✦</span><h2>Creá tu recorrido con IA</h2></div>
            <p>Contanos qué lugares querés visitar y cómo preferís moverte.</p>
            <form onSubmit={generarRecorrido}>
              <textarea value={pedidoIA} onChange={(e) => setPedidoIA(e.target.value)} rows={4} placeholder="Ej.: En París quiero visitar la Torre Eiffel, una cafetería y un banco. Organizá el recorrido caminando y optimizá el tiempo." />
              <button className="btn-ia" type="submit" disabled={cargando}>{cargando ? "Preparando recorrido..." : "✦ Generar recorrido"}</button>
            </form>
            {recorrido && (
              <div className="resultado-recorrido">
                <h3>{recorrido.nombre || "Tu recorrido"}</h3>
                <p>{recorrido.descripcion}</p>
                <ol>
                  {recorrido.paradas?.map((p, i) => <li key={`${p.id || p.nombre}-${i}`}><strong>{p.nombre}</strong><small>{p.direccion || p.tipo}</small></li>)}
                </ol>
                {ruta && <p className="texto-muted">Distancia: {(ruta.distanciaMetros / 1000).toFixed(1)} km · Duración estimada: {Math.round(ruta.duracionSegundos / 60)} min</p>}
              </div>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}
