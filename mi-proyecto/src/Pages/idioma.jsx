import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Copy,
  Globe2,
  Languages,
  ScanText,
  ShoppingBag,
  Siren,
  Utensils,
  BusFront,
  Volume2,
} from "lucide-react";
import "../Styles/idioma.css";
import "../index.css";
import { translateText as translateTextRequest, translateBatch } from "../services/languageService";

function Idioma() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [source, setSource] = useState("es");
  const [target, setTarget] = useState("en");
  const [phrases, setPhrases] = useState([]);

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh-CN", name: "中文" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "tr", name: "Türkçe" },
    { code: "nl", name: "Nederlands" },
    { code: "sv", name: "Svenska" },
    { code: "pl", name: "Polski" },
    { code: "el", name: "Ελληνικά" },
  ];

  const basePhrases = [
    {
      category: "Comidas",
      text: "Do you have a menu in English?",
      icon: Utensils,
    },
    {
      category: "Transporte",
      text: "Where is the station?",
      icon: BusFront,
    },
    {
      category: "Compras",
      text: "How much does it cost?",
      icon: ShoppingBag,
    },
    {
      category: "Emergencia",
      text: "Help!",
      icon: Siren,
      emergency: true,
    },
  ];

  const translateText = async () => {
    if (!text.trim()) {
      setTranslated("");
      return;
    }

    try {
      const data = await translateTextRequest({
        text,
        targetLanguage: target,
        sourceLanguage: source,
      });

      setTranslated(data.data.translatedText);
    } catch (error) {
      console.error(error);
      setTranslated("Error al traducir");
    }
  };

  const loadPhrases = async () => {
    try {
      const result = await translateBatch({
        texts: basePhrases.map((phrase) => phrase.text),
        targetLanguage: target,
        sourceLanguage: "en",
      });

      const translatedPhrases = basePhrases.map((phrase, index) => ({
        ...phrase,
        translated: result.data.translatedTexts?.[index] || phrase.text,
      }));

      setPhrases(translatedPhrases);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delay = setTimeout(translateText, 400);
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

  const copyText = async () => {
    if (translated) {
      await navigator.clipboard.writeText(translated);
    }
  };

  const speakText = () => {
    if (!translated) return;

    const speech = new SpeechSynthesisUtterance(translated);
    speech.lang = target;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="translator-container">
      <div className="translator-card">
        <header className="header">
          <div>
            <span className="translator-eyebrow">
              <Globe2 size={14} />
              Comunicación global
            </span>
            <h2>Traductor</h2>
          </div>

          <div className="brand-icon">
            <Languages size={23} />
          </div>
        </header>

        <div className="language-selector">
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            className="swap-button"
            type="button"
            onClick={swapLanguages}
            aria-label="Intercambiar idiomas"
            title="Intercambiar idiomas"
          >
            <ArrowLeftRight size={18} />
          </button>

          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
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

        <div className="counter">{text.length}/5000</div>

        <div className="translation-box">
          <p>{translated || "La traducción aparecerá aquí"}</p>

          <div className="translation-actions">
            <button
              type="button"
              onClick={speakText}
              disabled={!translated}
              aria-label="Escuchar traducción"
              title="Escuchar"
            >
              <Volume2 size={17} />
            </button>

            <button
              type="button"
              onClick={copyText}
              disabled={!translated}
              aria-label="Copiar traducción"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <section className="camera-card">
          <div className="camera-icon">
            <ScanText size={25} />
          </div>
          <div>
            <h4>Traducir con visión</h4>
            <p>Apunta tu cámara a carteles o menús</p>
          </div>
        </section>

        <section className="phrases">
          <h3>Frases esenciales</h3>

          {phrases.map((phrase, index) => {
            const PhraseIcon = phrase.icon;

            return (
              <article
                key={index}
                className={`phrase-card ${phrase.emergency ? "emergency" : ""}`}
              >
                <div className="phrase-icon">
                  <PhraseIcon size={18} />
                </div>

                <div className="phrase-content">
                  <h4>{phrase.category}</h4>
                  <p>{phrase.text}</p>
                  <small>{phrase.translated}</small>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default Idioma;
