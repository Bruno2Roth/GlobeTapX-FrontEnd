const CACHE_DURACION = 3600000

export function obtenerCache(key, ttl = CACHE_DURACION) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (Date.now() - cache.timestamp < ttl) return cache
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
