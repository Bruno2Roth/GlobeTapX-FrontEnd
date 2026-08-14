function CacheTimer({ timestamp }) {
  if (!timestamp) return null;
  return (
    <span className="cache-timer">
      ⏱ <span data-translate="Último cache">Último cache</span>: {new Date(timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

export default CacheTimer;
