const TIME_ZONES = {
  AR: "America/Argentina/Buenos_Aires",
  ES: "Europe/Madrid",
  IT: "Europe/Rome",
  FR: "Europe/Paris",
  GB: "Europe/London",
  BR: "America/Sao_Paulo",
  CL: "America/Santiago",
  AU: "Australia/Sydney",
  CN: "Asia/Shanghai",
  KR: "Asia/Seoul",
  IL: "Asia/Jerusalem",
  US: "America/New_York",
};

export function getTimeZoneForCountry(country) {
  return TIME_ZONES[String(country?.codigo || "").toUpperCase()] || "UTC";
}

export function formatClock(date, timeZone) {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);
}

export function formatClockDate(date, timeZone) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone,
  }).format(date);
}

function getOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const zonedTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return Math.round((zonedTime - date.getTime()) / 60000);
}

export function getTimeDifferenceLabel(date, timeZone, referenceTimeZone = "America/Argentina/Buenos_Aires") {
  const difference = getOffsetMinutes(date, timeZone) - getOffsetMinutes(date, referenceTimeZone);
  if (difference === 0) return "Misma hora que Argentina";

  const absoluteMinutes = Math.abs(difference);
  const amount = absoluteMinutes % 60 === 0
    ? `${absoluteMinutes / 60} ${absoluteMinutes === 60 ? "hora" : "horas"}`
    : `${Math.floor(absoluteMinutes / 60)} h ${absoluteMinutes % 60} min`;
  return `${amount} ${difference > 0 ? "más" : "menos"} que Argentina`;
}
