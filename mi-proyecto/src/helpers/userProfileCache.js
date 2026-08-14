import { obtenerCache, guardarCache } from "./cache";

const USER_PROFILE_CACHE_TTL = 15 * 60 * 1000;
const memoryCache = new Map();

function cacheKey(userId) {
  return `user_profile_cache_${userId}`;
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object") return null;

  const safeUser = { ...user };
  // Las URLs de foto pueden ser firmadas y expirar; se solicitan de nuevo cuando haga falta.
  delete safeUser.fotoPerfil;
  delete safeUser.password;
  delete safeUser.contrasena;
  return safeUser;
}

export function getCachedUserProfile(userId) {
  if (!userId) return null;

  const key = String(userId);
  const inMemory = memoryCache.get(key);
  if (inMemory) {
    if (Date.now() - inMemory.timestamp < USER_PROFILE_CACHE_TTL) {
      return inMemory.data;
    }
    memoryCache.delete(key);
  }

  const cached = obtenerCache(cacheKey(key), USER_PROFILE_CACHE_TTL);
  if (!cached?.data) return null;

  const user = sanitizeUser(cached.data);
  if (user) memoryCache.set(key, { timestamp: cached.timestamp, data: user });
  return user;
}

export function cacheUserProfile(user) {
  const safeUser = sanitizeUser(user);
  if (!safeUser?.id) return safeUser;

  const key = String(safeUser.id);
  memoryCache.set(key, { timestamp: Date.now(), data: safeUser });
  guardarCache(cacheKey(key), safeUser);
  return safeUser;
}

export function clearCachedUserProfile(userId) {
  if (!userId) return;
  const key = String(userId);
  memoryCache.delete(key);
  localStorage.removeItem(cacheKey(key));
}
