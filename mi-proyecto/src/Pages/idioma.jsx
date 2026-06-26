import { useState, useEffect } from "react";
import "../Styles/idioma.css";
import '../index.css'


function Idioma() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [source, setSource] = useState("es");
  const [target, setTarget] = useState("en");
  const [phrases, setPhrases] = useState([]);

const languages = [
  { code: "es", name: "🇪🇸 Español" },
  { code: "en", name: "🇺🇸 English" },
  { code: "fr", name: "🇫🇷 Français" },
  { code: "it", name: "🇮🇹 Italiano" },
  { code: "pt", name: "🇵🇹 Português" },
  { code: "de", name: "🇩🇪 Deutsch" },
  { code: "ja", name: "🇯🇵 日本語" },
  { code: "ko", name: "🇰🇷 한국어" },
  { code: "zh-CN", name: "🇨🇳 中文" },
  { code: "ru", name: "🇷🇺 Русский" },
  { code: "ar", name: "🇸🇦 العربية" },
  { code: "hi", name: "🇮🇳 हिन्दी" },
  { code: "tr", name: "🇹🇷 Türkçe" },
  { code: "nl", name: "🇳🇱 Nederlands" },
  { code: "sv", name: "🇸🇪 Svenska" },
  { code: "pl", name: "🇵🇱 Polski" },
  { code: "el", name: "🇬🇷 Ελληνικά" }
];

  const basePhrases = [
    {
      category: "🍴 Comidas",
      text: "Do you have a menu in English?"
    },
    {
      category: "🚌 Transporte",
      text: "Where is the station?"
    },
    {
      category: "🛍️ Compras",
      text: "How much does it cost?"
    },
    {
      category: "🚨 Emergencia",
      text: "Help!"
    }
  ];

  const translateText = async () => {
    if (!text.trim()) {
      setTranslated("");
      return;
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=${source}|${target}`
      );

      const data = await response.json();

      setTranslated(
        data.responseData?.translatedText ||
          "No se pudo traducir"
      );
    } catch (error) {
      console.error(error);
      setTranslated("Error al traducir");
    }
  };

  const loadPhrases = async () => {
    try {
      const translatedPhrases = await Promise.all(
        basePhrases.map(async (phrase) => {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
              phrase.text
            )}&langpair=en|${target}`
          );

          const data = await response.json();

          return {
            ...phrase,
            translated:
              data.responseData?.translatedText ||
              phrase.text
          };
        })
      );

      setPhrases(translatedPhrases);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      translateText();
    }, 400);

    return () => clearTimeout(delay);
  }, [text, source, target]);

  useEffect(() => {
    loadPhrases();
  }, [target]);

  const swapLanguages = () => {
    setSource(target);
    setTarget(source);
    setText(translated);
    setTranslated(text);
  };

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
            {languages.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
              >
                {lang.name}
              </option>
            ))}
          </select>

          <button onClick={swapLanguages}>
            ⇄
          </button>

          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {languages.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
              >
                {lang.name}
              </option>
            ))}
          </select>

        </div>

        <textarea
          placeholder="Escribe aquí para traducir..."
          value={text}
          maxLength={5000}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="counter">
          {text.length}/5000
        </div>

        <div className="translation-box">

          <p>
            {translated ||
              "La traducción aparecerá aquí"}
          </p>

          <div className="translation-actions">

            <button onClick={speakText}>
              🔊
            </button>

            <button onClick={copyText}>
              📋
            </button>

          </div>

        </div>

        <div className="camera-card">

          <div className="camera-icon">
            📷
          </div>

          <h4>
            Traducir con Visión
          </h4>

          <p>
            Apunta tu cámara a carteles o menús
          </p>

        </div>

        <div className="phrases">

          <h3>
            Frases Esenciales
          </h3>

          {phrases.map((phrase, index) => (
            <div
              key={index}
              className={`phrase-card ${
                phrase.category.includes(
                  "Emergencia"
                )
                  ? "emergency"
                  : ""
              }`}
            >
              <h4>
                {phrase.category}
              </h4>

              <p>
                {phrase.text}
              </p>

              <small>
                {phrase.translated}
              </small>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Idioma;