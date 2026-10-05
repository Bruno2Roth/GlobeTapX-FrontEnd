import test from "node:test";
import assert from "node:assert/strict";
import {
  getTimeDifferenceLabel,
  getTimeZoneForCountry,
} from "../src/helpers/worldClock.js";

test("resuelve zona horaria desde el código del país", () => {
  assert.equal(getTimeZoneForCountry({ codigo: "AR" }), "America/Argentina/Buenos_Aires");
  assert.equal(getTimeZoneForCountry({ codigo: "ES" }), "Europe/Madrid");
  assert.equal(getTimeZoneForCountry({ codigo: "XX" }), "UTC");
});

test("calcula diferencia horaria según el horario de verano de la fecha", () => {
  const invierno = new Date("2026-01-15T12:00:00Z");
  const verano = new Date("2026-07-15T12:00:00Z");

  assert.equal(getTimeDifferenceLabel(invierno, "Europe/Madrid"), "4 horas más que Argentina");
  assert.equal(getTimeDifferenceLabel(verano, "Europe/Madrid"), "5 horas más que Argentina");
  assert.equal(getTimeDifferenceLabel(invierno, "America/Argentina/Buenos_Aires"), "Misma hora que Argentina");
});
