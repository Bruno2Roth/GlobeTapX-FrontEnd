const API_BASE = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || `Error HTTP ${response.status}`);
  }
  return data;
}

export function buscarLugares({ lat, lon, radio = 1500, categoria = "todos" }) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radio: String(radio),
    categoria,
  });
  return apiRequest(`/explorar/lugares?${params}`);
}

export function crearRecorridoIA(payload) {
  return apiRequest("/explorar/recorrido-ia", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function calcularRuta(payload) {
  return apiRequest("/explorar/ruta", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
