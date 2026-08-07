const DEFAULT_LANGUAGE = "es";

export function normalizeLanguageCode(language) {
  return String(language || DEFAULT_LANGUAGE).trim().toLowerCase().split("-")[0] || DEFAULT_LANGUAGE;
}

export function setPreferredLanguage(language) {
  const normalized = normalizeLanguageCode(language);
  localStorage.setItem("preferredLanguage", normalized);
  document.documentElement.lang = normalized;
  return normalized;
}

function translatableElements() {
  return [...document.querySelectorAll("[data-translate]")];
}

export async function translatePage(language = DEFAULT_LANGUAGE) {
  const targetLanguage = setPreferredLanguage(language);
  const elements = translatableElements();

  if (targetLanguage === DEFAULT_LANGUAGE || !elements.length) {
    elements.forEach((element) => { element.textContent = element.dataset.translate; });
    return;
  }

  const token = localStorage.getItem("token");
  const response = await fetch("/api/traduccion/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({
      texts: elements.map((element) => element.dataset.translate),
      sourceLanguage: DEFAULT_LANGUAGE,
      targetLanguage,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(payload.error || "No se pudo traducir la interfaz");

  const translations = payload.data?.translations || payload.data?.translatedTexts || payload.translations || payload.translatedTexts || [];
  elements.forEach((element, index) => {
    if (translations[index]) element.textContent = translations[index];
  });
}

export function initLanguageSelector(selectorId = "language-selector") {
  const selector = document.getElementById(selectorId);
  if (!selector) return () => {};

  const applyLanguage = (language) => {
    const normalized = setPreferredLanguage(language);
    void translatePage(normalized).catch((error) => console.warn("No se pudo traducir la interfaz:", error));
  };
  selector.value = normalizeLanguageCode(localStorage.getItem("preferredLanguage") || selector.value);
  applyLanguage(selector.value);
  const handleChange = (event) => applyLanguage(event.target.value);
  selector.addEventListener("change", handleChange);
  return () => selector.removeEventListener("change", handleChange);
}

