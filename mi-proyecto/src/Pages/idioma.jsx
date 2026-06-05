import { useState, useEffect } from "react";
import "../index.css";

function Idioma() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [source, setSource] = useState("es");
  const [target, setTarget] = useState("en");

  const phrases = {
    en: {
      food: "Do you have a menu in English?",
      transport: "Where is the station?",
      shopping: "How much does it cost?",
      emergency: "Help!"
    },
    es: {
      food: "¿Tienen menú en español?",
      transport: "¿Dónde está la estación?",
      shopping: "¿Cuánto cuesta?",
      emergency: "¡Ayuda!"
    },
    fr: {
      food: "Avez-vous un menu en français ?",
      transport: "Où est la gare ?",
      shopping: "Combien ça coûte ?",
      emergency: "Au secours !"
    },
    it: {
      food: "Avete un menù in italiano?",
      transport: "Dov'è la stazione?",
      shopping: "Quanto costa?",
      emergency: "Aiuto!"
    }
  };

  const translateText = async () => {
    if (!text.trim()) {
      setTranslated("");
      return;
    }

    try {
      const response = await fetch(
        "https://translate.argosopentech.com/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: text,
            source,
            target,
            format: "text",
          }),
        }
      );

      const data = await response.json();
      setTranslated(data.translatedText);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    translateText();
  }, [text, source, target]);

  const copyText = () => {
    navigator.clipboard.writeText(translated);
  };

  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(translated);
    speech.lang = target;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="translator-container">
      <div className="translator-card">

        <div className="header">
          <h2>🌍 GlobeTapX Translator</h2>
        </div>

        <div className="language-selector">

          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>

          <span>⇄</span>

          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>

        </div>

        <textarea
          placeholder="Escribe aquí para traducir..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="translation-box">
          <p>{translated || "Aquí aparecerá la traducción..."}</p>

          <div className="translation-actions">
            <button onClick={speakText}>🔊</button>
            <button onClick={copyText}>📋</button>
          </div>
        </div>

        <div className="phrases">

          <h3>Frases útiles</h3>

          <div className="phrase food">
            <h4>🍴 Comida</h4>
            <span>{phrases[target]?.food}</span>
          </div>

          <div className="phrase transport">
            <h4>🚌 Transporte</h4>
            <span>{phrases[target]?.transport}</span>
          </div>

          <div className="phrase shopping">
            <h4>🛍️ Compras</h4>
            <span>{phrases[target]?.shopping}</span>
          </div>

          <div className="phrase emergency">
            <h4>🚨 Emergencia</h4>
            <span>{phrases[target]?.emergency}</span>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Idioma;
