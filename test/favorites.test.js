import test from "node:test";
import assert from "node:assert/strict";
import { normalizeFavoriteCollection } from "../src/helpers/favorites.js";

test("normaliza colecciones de favoritos con eventos relacionados", () => {
  const rows = normalizeFavoriteCollection({
    data: [{
      ID: 9,
      IDEvento: 3,
      evento: { ID: 3, nombre: "Festival" },
    }],
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].IDEvento, 3);
  assert.equal(rows[0].evento.nombre, "Festival");
});

test("acepta alias históricos y descarta filas sin evento", () => {
  const rows = normalizeFavoriteCollection({
    favorites: [{ id: 4, id_evento: 8 }, { id: 5 }],
  });

  assert.deepEqual(rows.map((row) => [row.IDEvento, row.id]), [[8, 4]]);
});
