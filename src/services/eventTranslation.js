import { translateBatch } from "./backendApi";

// /traduccion/batch responde { success, data: [{ text, translatedText }] }.
export async function translateEvents(events, language) {
  if (language === "es" || !events.length) return events;

  const fields = ["nombre", "descripcion", "categoria"];
  const texts = events.flatMap((event) => fields.map((field) => event[field]).filter(Boolean));
  if (!texts.length) return events;

  const response = await translateBatch({ texts, targetLanguage: language, sourceLanguage: "es" });
  if (!Array.isArray(response?.data) || response.data.length !== texts.length) return events;

  let index = 0;
  return events.map((event) => {
    const translated = { ...event };
    fields.forEach((field) => {
      if (!event[field]) return;
      translated[field] = response.data[index++]?.translatedText || event[field];
    });
    return translated;
  });
}
