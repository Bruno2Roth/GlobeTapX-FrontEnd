import { getStoredToken } from "../services/api";

export function requireAuth() {
  const token = getStoredToken();
  if (!token) {
    window.location.href = "/";
  }
  return Boolean(token);
}
