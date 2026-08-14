export const CONNECTION_ERROR_MESSAGE = "No es posible conectarse";

const STATUS_MESSAGES = {
  401: "Tu sesión expiró. Redirigiendo al inicio de sesión…",
  403: "No tienes permisos",
  503: "Servicio temporalmente no disponible. Puedes reintentar.",
};

function responseMessage(error) {
  const data = error?.data || error?.response?.data;
  const message = data?.message;
  if (typeof message !== "string") return "";

  const normalized = message.trim();
  // Solo mostramos el mensaje común del backend; nunca SQL, stack traces ni
  // detalles internos de Storage.
  if (!normalized || normalized.length > 160 || /\b(sql|select|insert|update|delete|stack|exception|storage)\b|\bat\s+[^ ]+\(/i.test(normalized)) {
    return "";
  }
  return normalized;
}

export function getErrorStatus(error) {
  return Number(error?.status ?? error?.response?.status ?? 0);
}

export function getUserFacingError(error, fallback = CONNECTION_ERROR_MESSAGE) {
  const status = getErrorStatus(error);
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  if (status === 400) return responseMessage(error) || "Solicitud no válida";
  return fallback;
}

export function isUnauthorizedError(error) {
  return getErrorStatus(error) === 401;
}
