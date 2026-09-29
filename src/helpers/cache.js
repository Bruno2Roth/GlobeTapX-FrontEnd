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

export function invalidarCacheAgenda(userId) {
  if (!userId) return
  try {
    const prefix = `agenda_${userId}_`
    const keys = []
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (key?.startsWith(prefix)) keys.push(key)
    }
    keys.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Si Storage no está disponible, la solicitud al backend ya se completó.
  }
}
