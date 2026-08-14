import { useCallback, useEffect, useState } from "react";
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
import { CONNECTION_ERROR_MESSAGE } from "../helpers/errorMessages";
import { LANGUAGE_OPTIONS, normalizeLanguageCode } from "../helpers/translatePage";

const BASE_PHRASES = [
  { category: "Comidas", text: "Do you have a menu in English?", icon: Utensils },
  { category: "Transporte", text: "Where is the station?", icon: BusFront },
  { category: "Compras", text: "How much does it cost?", icon: ShoppingBag },
  { category: "Emergencia", text: "Help!", icon: Siren, emergency: true },
];

function Idioma() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [source, setSource] = useState("es");
  const [target, setTarget] = useState("en");
  const [phrases, setPhrases] = useState([]);

  const languages = LANGUAGE_OPTIONS;

  const translateText = useCallback(async () => {
    if (!text.trim()) {
      setTranslated("");
      return;
    }

    try {
      const response = await translateTextRequest({
        text,
        targetLanguage: normalizeLanguageCode(target),
        sourceLanguage: normalizeLanguageCode(source),
      });
      const data = response?.data ?? response;
      setTranslated(data?.translatedText || data?.translation || "");
    } catch (error) {
      console.error("Translation request failed", error);
      setTranslated(CONNECTION_ERROR_MESSAGE);
    }
  }, [source, target, text]);

  const loadPhrases = useCallback(async () => {
    try {
      const response = await translateBatch({
        texts: BASE_PHRASES.map((phrase) => phrase.text),
        targetLanguage: normalizeLanguageCode(target),
        sourceLanguage: "en",
      });
      const data = response?.data ?? response;
      const translatedTexts = data?.translatedTexts || data?.translations || [];
      setPhrases(BASE_PHRASES.map((phrase, index) => ({
        ...phrase,
        translated: translatedTexts[index] || phrase.text,
      })));
    } catch (error) {
      console.error("Batch translation request failed", error);
      setPhrases([]);
    }
  }, [target]);

  useEffect(() => {
    const delay = setTimeout(translateText, 400);
    return () => clearTimeout(delay);
  }, [translateText]);

  useEffect(() => {
    void Promise.resolve().then(loadPhrases);
  }, [loadPhrases]);

  const swapLanguages = () => {
    setSource(target);
    setTarget(source);
    setText(translated);
    setTranslated(text);
  };

  const copyText = async () => {
    if (translated) await navigator.clipboard.writeText(translated);
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
            <span className="translator-eyebrow"><Globe2 size={14} />Comunicación global</span>
            <h2>Traductor</h2>
          </div>
          <div className="brand-icon"><Languages size={23} /></div>
        </header>

        <div className="language-selector">
          <select value={source} onChange={(event) => setSource(normalizeLanguageCode(event.target.value))}>
            {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
          </select>

          <button className="swap-button" type="button" onClick={swapLanguages} aria-label="Intercambiar idiomas" title="Intercambiar idiomas">
            <ArrowLeftRight size={18} />
          </button>

          <select value={target} onChange={(event) => setTarget(normalizeLanguageCode(event.target.value))}>
            {languages.map((language) => <option key={language.code} value={language.code}>{language.name}</option>)}
          </select>
        </div>

        <textarea placeholder="Escribe aquí para traducir..." value={text} maxLength={5000} onChange={(event) => setText(event.target.value)} />
        <div className="counter">{text.length}/5000</div>

        <div className="translation-box">
          <p>{translated || "La traducción aparecerá aquí"}</p>
          <div className="translation-actions">
            <button type="button" onClick={speakText} disabled={!translated} aria-label="Escuchar traducción" title="Escuchar"><Volume2 size={17} /></button>
            <button type="button" onClick={copyText} disabled={!translated} aria-label="Copiar traducción" title="Copiar"><Copy size={16} /></button>
          </div>
        </div>

        <section className="camera-card">
          <div className="camera-icon"><ScanText size={25} /></div>
          <div><h4>Traducir con visión</h4><p>Apunta tu cámara a carteles o menús</p></div>
        </section>

        <section className="phrases">
          <h3>Frases esenciales</h3>
          {phrases.map((phrase, index) => {
            const PhraseIcon = phrase.icon;
            return (
              <article key={index} className={`phrase-card ${phrase.emergency ? "emergency" : ""}`}>
                <div className="phrase-icon"><PhraseIcon size={18} /></div>
                <div className="phrase-content"><h4>{phrase.category}</h4><p>{phrase.text}</p><small>{phrase.translated}</small></div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default Idioma;
