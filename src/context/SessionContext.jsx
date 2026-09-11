import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentUser,
  getCurrentUserPhoto,
  login as loginRequest,
  register as registerRequest,
  updateCurrentUser,
  uploadCurrentUserPhoto,
  updatePreferredLanguage as updatePreferredLanguageRequest,
} from "../services/backendApi";
import {
  clearStoredToken,
  getStoredToken,
  SESSION_EXPIRED_EVENT,
  setStoredToken,
} from "../services/api";
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";

const SessionContext = createContext(null);
const MAX_TOKEN_LENGTH = 5000;

function clearLegacyIdentityStorage() {
  if (typeof localStorage === "undefined") return;

  try {
    ["user", "userId", "fotoPerfil", "authSession", "preferredLanguage", "preferredLanguageId"]
      .forEach((key) => localStorage.removeItem(key));

    const legacyPrefixes = ["user_profile_cache_", "perfil_cache_"];
    const keysToRemove = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && legacyPrefixes.some((prefix) => key.startsWith(prefix))) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // La migración no debe impedir que la sesión se gestione en memoria.
  }
}

function normalizeUser(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;

  const rawId = candidate.id ?? candidate.ID;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) return null;

  // La foto y las credenciales no forman parte del estado de usuario. La
  // primera vive en `photo` y las segundas nunca deben llegar al frontend.
  const user = { ...candidate, id };
  ["fotoPerfil", "fotoPath", "foto", "photo", "image", "profileImage", "avatar", "avatarUrl"]
    .forEach((field) => delete user[field]);
  delete user.password;
  delete user.contrasena;
  return user;
}

function extractUser(response) {
  const payload = response?.data ?? response;
  const candidate = payload?.user
    || payload?.usuario
    || payload?.updatedUser
    || payload?.data?.user
    || payload?.data;
  return normalizeUser(candidate);
}

function extractAuth(response) {
  const payload = response?.data ?? response;
  const data = payload?.token ? payload : payload?.data ?? payload;
  return {
    token: typeof data?.token === "string" ? data.token : "",
    user: normalizeUser(data?.user || data?.usuario),
  };
}

function extractPhoto(response) {
  const payload = response?.data ?? response;
  const data = payload?.data ?? payload;
  if (typeof data === "string") return data;
  return data?.fotoPerfil || data?.url || data?.photo || "";
}

function authError() {
  const error = new Error(CONNECTION_ERROR_MESSAGE);
  error.status = 401;
  return error;
}

function isSessionInvalid(error) {
  const status = Number(error?.status ?? error?.response?.status ?? 0);
  return status === 401 || status === 431;
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRef = useRef(null);
  const photoRef = useRef("");
  const sessionVersion = useRef(0);

  const commitUser = useCallback((nextUser, nextPhoto = photoRef.current) => {
    const safeUser = normalizeUser(nextUser);
    const safePhoto = typeof nextPhoto === "string" ? nextPhoto : "";
    userRef.current = safeUser;
    photoRef.current = safePhoto;
    setUser(safeUser);
    setPhoto(safePhoto);
  }, []);

  const loadPhoto = useCallback(async (userToLoad = userRef.current, version = sessionVersion.current) => {
    const safeUser = normalizeUser(userToLoad);
    if (!safeUser?.id) return "";

    const response = await getCurrentUserPhoto(safeUser.id);
    const nextPhoto = extractPhoto(response);
    if (version === sessionVersion.current) {
      photoRef.current = nextPhoto;
      setPhoto(nextPhoto);
    }
    return nextPhoto;
  }, []);

  const logout = useCallback(() => {
    sessionVersion.current += 1;
    clearStoredToken();
    clearLegacyIdentityStorage();
    commitUser(null, "");
    setError(null);
    setLoading(false);
  }, [commitUser]);

  useEffect(() => {
    const handleSessionExpired = () => {
      sessionVersion.current += 1;
      clearStoredToken();
      clearLegacyIdentityStorage();
      commitUser(null, "");
      setError(null);
      setLoading(false);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [commitUser]);

  useEffect(() => {
    clearLegacyIdentityStorage();
    const token = getStoredToken();
    if (!token) {
      commitUser(null, "");
      setLoading(false);
      return undefined;
    }

    let active = true;
    const version = sessionVersion.current;

    const restoreSession = async () => {
      try {
        const response = await getCurrentUser();
        const restoredUser = extractUser(response);
        if (!restoredUser?.id) throw authError();
        if (!active || version !== sessionVersion.current) return;

        commitUser(restoredUser, "");
        setError(null);
        setLoading(false);
        try {
          await loadPhoto(restoredUser, version);
        } catch (photoError) {
          if (isSessionInvalid(photoError)) throw photoError;
          if (active) console.warn("No se pudo cargar la foto de sesión:", photoError);
        }
      } catch (restoreError) {
        if (!active) return;
        if (isSessionInvalid(restoreError)) logout();
        else {
          setError(restoreError);
          setLoading(false);
        }
      }
    };

    void restoreSession();
    return () => { active = false; };
  }, [commitUser, loadPhoto, logout]);

  const login = useCallback(async (credentials) => {
    const version = sessionVersion.current + 1;
    sessionVersion.current = version;
    clearStoredToken();
    clearLegacyIdentityStorage();
    commitUser(null, "");
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest(credentials);
      const auth = extractAuth(response);
      if (!auth.token || auth.token.length > MAX_TOKEN_LENGTH) throw authError();
      if (version !== sessionVersion.current) return auth;

      setStoredToken(auth.token);
      let authenticatedUser = auth.user;
      if (!authenticatedUser?.id) authenticatedUser = extractUser(await getCurrentUser());
      if (!authenticatedUser?.id) throw authError();
      if (version !== sessionVersion.current) return { ...auth, user: authenticatedUser };

      commitUser(authenticatedUser, "");
      setLoading(false);
      try {
        await loadPhoto(authenticatedUser, version);
      } catch (photoError) {
        if (isSessionInvalid(photoError)) throw photoError;
        console.warn("No se pudo cargar la foto de sesión:", photoError);
      }
      return { ...auth, user: authenticatedUser };
    } catch (requestError) {
      if (version === sessionVersion.current) {
        clearStoredToken();
        commitUser(null, "");
        setLoading(false);
        setError(requestError);
      }
      throw requestError;
    }
  }, [commitUser, loadPhoto]);

  const register = useCallback(async (data, profilePhoto = null) => {
    const version = sessionVersion.current + 1;
    sessionVersion.current = version;
    clearStoredToken();
    clearLegacyIdentityStorage();
    commitUser(null, "");
    setError(null);
    setLoading(true);

    try {
      const response = await registerRequest(data);
      const auth = extractAuth(response);
      if (!auth.token || auth.token.length > MAX_TOKEN_LENGTH) throw authError();
      if (version !== sessionVersion.current) return auth;

      setStoredToken(auth.token);
      let authenticatedUser = auth.user;
      if (!authenticatedUser?.id) authenticatedUser = extractUser(await getCurrentUser());
      if (!authenticatedUser?.id) throw authError();

      let photoUploadFailed = false;
      let uploadedPhoto = "";
      if (profilePhoto) {
        try {
          const uploadResponse = await uploadCurrentUserPhoto(authenticatedUser.id, profilePhoto);
          uploadedPhoto = extractPhoto(uploadResponse);
        } catch (photoError) {
          if (isSessionInvalid(photoError)) throw photoError;
          photoUploadFailed = true;
          console.warn("No se pudo guardar la foto de registro:", photoError);
        }
      }

      if (version !== sessionVersion.current) return { ...auth, user: authenticatedUser, photoUploadFailed };
      commitUser(authenticatedUser, uploadedPhoto);
      setLoading(false);
      if (!uploadedPhoto) {
        try {
          await loadPhoto(authenticatedUser, version);
        } catch (photoError) {
          if (isSessionInvalid(photoError)) throw photoError;
          console.warn("No se pudo cargar la foto de sesión:", photoError);
        }
      }
      return { ...auth, user: authenticatedUser, photoUploadFailed };
    } catch (requestError) {
      if (version === sessionVersion.current) {
        clearStoredToken();
        commitUser(null, "");
        setLoading(false);
        setError(requestError);
      }
      throw requestError;
    }
  }, [commitUser, loadPhoto]);

  const refreshUser = useCallback(async () => {
    const version = sessionVersion.current;
    if (!getStoredToken()) throw authError();
    const response = await getCurrentUser();
    const nextUser = extractUser(response);
    if (!nextUser?.id) throw authError();
    if (version !== sessionVersion.current) return userRef.current;
    commitUser(nextUser, photoRef.current);
    return nextUser;
  }, [commitUser]);

  const updateUser = useCallback(async (changes) => {
    const version = sessionVersion.current;
    const currentUser = userRef.current;
    if (!currentUser?.id) throw authError();

    const response = await updateCurrentUser(currentUser.id, changes);
    if (version !== sessionVersion.current) return userRef.current;
    const responseUser = extractUser(response);
    let nextUser = responseUser?.id ? responseUser : null;
    try {
      nextUser = await refreshUser();
    } catch (refreshError) {
      if (isSessionInvalid(refreshError) || !nextUser) throw refreshError;
    }

    if (version !== sessionVersion.current) return userRef.current;
    commitUser(nextUser, photoRef.current);
    return nextUser;
  }, [commitUser, refreshUser]);

  const updatePhoto = useCallback(async (file) => {
    const version = sessionVersion.current;
    const currentUser = userRef.current;
    if (!currentUser?.id) throw authError();

    const response = await uploadCurrentUserPhoto(currentUser.id, file);
    if (version !== sessionVersion.current) return photoRef.current;
    const uploadedPhoto = extractPhoto(response);
    if (uploadedPhoto) {
      photoRef.current = uploadedPhoto;
      setPhoto(uploadedPhoto);
      return uploadedPhoto;
    }
    return loadPhoto(currentUser, sessionVersion.current);
  }, [loadPhoto]);

  const updateLanguage = useCallback(async (selection) => {
    const version = sessionVersion.current;
    const currentUser = userRef.current;
    if (!currentUser?.id) throw authError();

    const response = await updatePreferredLanguageRequest(selection);
    if (version !== sessionVersion.current) return userRef.current;
    const nextLanguage = {
      idiomaId: response?.idiomaId ?? selection.idiomaId,
      codigoIdioma: response?.codigoIdioma ?? selection.codigoIdioma,
    };
    const nextUser = { ...currentUser, idiomaPreferido: nextLanguage };
    commitUser(nextUser, photoRef.current);
    return nextUser;
  }, [commitUser]);

  const value = useMemo(() => ({
    user,
    photo,
    userId: user?.id ?? null,
    loading,
    error,
    isAuthenticated: Boolean(user?.id),
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    updatePhoto,
    updateLanguage,
  }), [error, loading, login, logout, photo, refreshUser, register, updateLanguage, updatePhoto, updateUser, user]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession debe utilizarse dentro de SessionProvider");
  return context;
}
