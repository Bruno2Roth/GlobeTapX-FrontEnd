import { cacheUserProfile, clearCachedUserProfile } from "../helpers/userProfileCache";

const AUTH_SESSION_EVENT = "authsessionchange";

let currentSession = { user: null, photo: "" };

function withoutSignedPhoto(user) {
  if (!user || typeof user !== "object") return user;
  const safeUser = { ...user };
  delete safeUser.fotoPerfil;
  return safeUser;
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_EVENT, { detail: currentSession }));
  }
}

export function getAuthSession() {
  return currentSession;
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? withoutSignedPhoto(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(user, photo = "") {
  currentSession = {
    user: user ? { ...user } : null,
    photo: typeof photo === "string" ? photo : "",
  };

  if (currentSession.user) {
    localStorage.setItem("userId", String(currentSession.user.id));
    localStorage.setItem("user", JSON.stringify(withoutSignedPhoto(currentSession.user)));
    cacheUserProfile(currentSession.user);
  } else {
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }

  // Las URLs firmadas pueden expirar; nunca se guardan como caché permanente.
  localStorage.removeItem("fotoPerfil");
  notify();
  return currentSession;
}

export function clearAuthSession() {
  const previousUserId = currentSession.user?.id || localStorage.getItem("userId");
  currentSession = { user: null, photo: "" };
  clearCachedUserProfile(previousUserId);
  ["token", "userId", "user", "fotoPerfil", "preferredLanguage"].forEach((key) => localStorage.removeItem(key));
  notify();
}

export function subscribeAuthSession(listener) {
  if (typeof window === "undefined") return () => {};
  const handleChange = (event) => listener(event.detail || currentSession);
  window.addEventListener(AUTH_SESSION_EVENT, handleChange);
  return () => window.removeEventListener(AUTH_SESSION_EVENT, handleChange);
}
