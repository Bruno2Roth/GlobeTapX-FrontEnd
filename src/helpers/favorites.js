export function normalizeFavoriteCollection(response) {
  const payload = response?.data ?? response;
  const rows = Array.isArray(payload)
    ? payload
    : payload?.favorites ?? payload?.favoritos ?? payload?.items ?? [];

  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    ...row,
    IDEvento: row.IDEvento ?? row.idEvento ?? row.id_evento ?? row.evento?.ID ?? row.evento?.id,
    evento: row.evento ?? row.Evento ?? null,
  })).filter((row) => row.IDEvento !== undefined && row.IDEvento !== null);
}
