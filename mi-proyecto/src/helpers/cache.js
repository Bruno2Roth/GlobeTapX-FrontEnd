const CACHE_DURACION = 3600000

export function obtenerCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (Date.now() - cache.timestamp < CACHE_DURACION) return cache
    localStorage.removeItem(key)
    return null
  } catch {
    return null
  }
}

export function guardarCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
  } catch {}
}
