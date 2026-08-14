import { getLanguageTags, translateBatch } from "../services/languageService";
import { CONNECTION_ERROR_MESSAGE } from "./errorMessages";

const DEFAULT_LANGUAGE = "es";
const DEFAULT_LANGUAGE_ID = 1;

const LANGUAGE_DEFINITIONS = [
  { idiomaId: 1, code: "es", name: "Español", nativeName: "Español" },
  { idiomaId: 2, code: "en", name: "English", nativeName: "English" },
  { idiomaId: 3, code: "fr", name: "Français", nativeName: "Français" },
  { idiomaId: 4, code: "it", name: "Italiano", nativeName: "Italiano" },
  { idiomaId: 5, code: "pt", name: "Português", nativeName: "Português" },
  { idiomaId: 6, code: "ko", name: "한국어", nativeName: "한국어" },
  { idiomaId: 7, code: "zh", name: "中文", nativeName: "中文" },
  { idiomaId: 8, code: "he", name: "עברית", nativeName: "עברית" },
];

export const SUPPORTED_LANGUAGE_CODES = LANGUAGE_DEFINITIONS.map(({ code }) => code);
export const LANGUAGE_OPTIONS = LANGUAGE_DEFINITIONS.map((language) => ({
  ...language,
  id: language.idiomaId,
}));

const LANGUAGE_BY_CODE = new Map(LANGUAGE_OPTIONS.map((language) => [language.code, language]));
const LANGUAGE_BY_ID = new Map(LANGUAGE_OPTIONS.map((language) => [language.idiomaId, language]));

function unwrapResponse(response) {
  let payload = response?.data ?? response;
  if (payload?.data && !Array.isArray(payload.data)) payload = payload.data;
  return payload;
}

export function normalizeLanguageCode(language) {
  if (typeof language === "number" || /^\d+$/.test(String(language || ""))) {
    return getLanguageCodeForId(language);
  }

  const raw = String(language || DEFAULT_LANGUAGE).trim().toLowerCase().split("-")[0];
  const normalized = raw === "iw" ? "he" : raw;
  return SUPPORTED_LANGUAGE_CODES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

export function normalizeLanguageCatalog(response) {
  const payload = response?.data ?? response;
  let list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.idiomas || payload?.languages || payload?.items || [];

  if (!Array.isArray(list) && list && typeof list === "object") {
    list = Object.entries(list).map(([codigoIdioma, value]) => ({ codigoIdioma, ...(value || {}) }));
  }

  const seen = new Set();
  return list.map((language) => {
    if (!language) return null;
    if (typeof language === "string") {
      const code = normalizeLanguageCode(language);
      const fallback = LANGUAGE_BY_CODE.get(code);
      return fallback ? { ...fallback, id: fallback.idiomaId } : null;
    }

    const rawId = language.idiomaId ?? language.id ?? language.languageId;
    const rawCode = language.codigoIdioma || language.codigo || language.code;
    const code = normalizeLanguageCode(rawCode || getLanguageCodeForId(rawId));
    const parsedId = Number(rawId);
    const idiomaId = Number.isInteger(parsedId) && parsedId > 0
      ? parsedId
      : LANGUAGE_BY_CODE.get(code)?.idiomaId;
    const fallback = LANGUAGE_BY_CODE.get(code);
    if (!Number.isInteger(idiomaId) || idiomaId < 1) return null;

    return {
      ...language,
      id: idiomaId,
      idiomaId,
      code,
      name: language.nombre || language.name || language.nombreIdioma || fallback?.name || code,
      nativeName: language.nombreNativo || language.nativeName || fallback?.nativeName || language.nombre || code,
    };
  }).filter((language) => {
    if (!language || seen.has(language.idiomaId)) return false;
    seen.add(language.idiomaId);
    return true;
  });
}

export function normalizeSupportedLanguages(response) {
  return normalizeLanguageCatalog(response);
}

export function getLanguageIdForCode(code, catalog = []) {
  const normalizedCode = normalizeLanguageCode(code);
  const fromCatalog = normalizeLanguageCatalog(catalog).find((language) => language.code === normalizedCode);
  return fromCatalog?.idiomaId || LANGUAGE_BY_CODE.get(normalizedCode)?.idiomaId || DEFAULT_LANGUAGE_ID;
}

export function getLanguageCodeForId(id, catalog = []) {
  const numericId = Number(id);
  const fromCatalog = normalizeLanguageCatalog(catalog).find((language) => language.idiomaId === numericId);
  return fromCatalog?.code || LANGUAGE_BY_ID.get(numericId)?.code || DEFAULT_LANGUAGE;
}

export function resolveLanguageSelection(value, catalog = []) {
  const payload = unwrapResponse(value);
  const preferred = payload?.idiomaPreferido ?? payload?.preferredLanguage ?? payload?.idioma ?? payload;
  const candidate = preferred && typeof preferred === "object" ? preferred : { codigoIdioma: preferred };
  const catalogLanguages = normalizeLanguageCatalog(catalog);
  const rawId = candidate?.idiomaId ?? candidate?.languageId ?? candidate?.id;
  const numericId = Number(rawId);
  const validId = Number.isInteger(numericId) && numericId > 0 ? numericId : null;
  const rawCode = candidate?.codigoIdioma || candidate?.codigo || candidate?.code || candidate?.idioma;
  const code = rawCode ? normalizeLanguageCode(rawCode) : getLanguageCodeForId(validId, catalogLanguages);
  const idiomaId = validId || getLanguageIdForCode(code, catalogLanguages);

  return {
    idiomaId,
    id: idiomaId,
    codigoIdioma: getLanguageCodeForId(idiomaId, catalogLanguages) || code,
    code: getLanguageCodeForId(idiomaId, catalogLanguages) || code,
  };
}

export function setPreferredLanguage(language, idiomaId) {
  const selection = resolveLanguageSelection(
    idiomaId === undefined ? language : { codigoIdioma: language, idiomaId },
  );
  localStorage.setItem("preferredLanguage", selection.codigoIdioma);
  localStorage.setItem("preferredLanguageId", String(selection.idiomaId));
  document.documentElement.lang = selection.codigoIdioma;
  return selection.codigoIdioma;
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

// El catálogo actual del backend todavía no contiene navegación ni textos de
// la landing. Estas cadenas cubren esa UI mientras esos tags se incorporan al
// catálogo; los tags del backend siempre tienen prioridad.
const UI_TRANSLATIONS = {
  "inicio": { es: "Inicio", en: "Home", fr: "Accueil", it: "Home", pt: "Início", ko: "홈", zh: "首页", he: "בית" },
  "home": { es: "Inicio", en: "Home", fr: "Accueil", it: "Home", pt: "Início", ko: "홈", zh: "首页", he: "בית" },
  "clima": { es: "Clima", en: "Weather", fr: "Météo", it: "Meteo", pt: "Clima", ko: "날씨", zh: "天气", he: "מזג אוויר" },
  "cambio": { es: "Cambio", en: "Exchange", fr: "Change", it: "Cambio", pt: "Câmbio", ko: "환율", zh: "汇率", he: "המרת מטבע" },
  "ayuda": { es: "Ayuda", en: "Help", fr: "Aide", it: "Aiuto", pt: "Ajuda", ko: "도움말", zh: "帮助", he: "עזרה" },
  "idioma": { es: "Idioma", en: "Language", fr: "Langue", it: "Lingua", pt: "Idioma", ko: "언어", zh: "语言", he: "שפה" },
  "agenda": { es: "Agenda", en: "Schedule", fr: "Agenda", it: "Agenda", pt: "Agenda", ko: "일정", zh: "日程", he: "סדר יום" },
  "eventos": { es: "Eventos", en: "Events", fr: "Événements", it: "Eventi", pt: "Eventos", ko: "이벤트", zh: "活动", he: "אירועים" },
  "documentación": { es: "Documentación", en: "Documentation", fr: "Documentation", it: "Documentazione", pt: "Documentação", ko: "문서", zh: "文档", he: "תיעוד" },
  "favoritos": { es: "Favoritos", en: "Favorites", fr: "Favoris", it: "Preferiti", pt: "Favoritos", ko: "즐겨찾기", zh: "收藏夹", he: "מועדפים" },
  "perfil": { es: "Perfil", en: "Profile", fr: "Profil", it: "Profilo", pt: "Perfil", ko: "프로필", zh: "个人资料", he: "פרופיל" },
  "reglas": { es: "Reglas", en: "Rules", fr: "Règles", it: "Regole", pt: "Regras", ko: "규칙", zh: "规则", he: "כללים" },
  "hola": { es: "Hola", en: "Hello", fr: "Bonjour", it: "Ciao", pt: "Olá", ko: "안녕하세요", zh: "你好", he: "שלום" },
  "tu viaje global comienza aquí": { es: "Tu viaje global comienza aquí", en: "Your global journey starts here", fr: "Votre voyage mondial commence ici", it: "Il tuo viaggio globale inizia qui", pt: "Sua viagem global começa aqui", ko: "당신의 글로벌 여행은 여기서 시작됩니다", zh: "全球之旅从这里开始", he: "המסע הגלובלי שלך מתחיל כאן" },
  "tu viaje comienza aquí ✈": { es: "Tu viaje comienza aquí ✈", en: "Your journey starts here ✈", fr: "Votre voyage commence ici ✈", it: "Il tuo viaggio inizia qui ✈", pt: "Sua viagem começa aqui ✈", ko: "여기서 여행을 시작하세요 ✈", zh: "旅程从这里开始 ✈", he: "המסע שלך מתחיל כאן ✈" },
  "explorá destinos increíbles con globetapx": { es: "Explorá destinos increíbles con GlobeTapX", en: "Explore amazing destinations with GlobeTapX", fr: "Explorez des destinations incroyables avec GlobeTapX", it: "Esplora destinazioni incredibili con GlobeTapX", pt: "Explore destinos incríveis com a GlobeTapX", ko: "GlobeTapX와 함께 멋진 여행지를 탐험하세요", zh: "与 GlobeTapX 一起探索精彩目的地", he: "גלה יעדים מדהימים עם GlobeTapX" },
  "explorar": { es: "Explorar", en: "Explore", fr: "Explorer", it: "Esplora", pt: "Explorar", ko: "탐색", zh: "探索", he: "חקור" },
  "¿a dónde vamos ahora?": { es: "¿A dónde vamos ahora?", en: "Where are we going now?", fr: "Où allons-nous maintenant ?", it: "Dove andiamo adesso?", pt: "Para onde vamos agora?", ko: "이제 어디로 갈까요?", zh: "我们现在要去哪里？", he: "לאן נוסעים עכשיו?" },
  "currently exploring": { es: "EXPLORANDO ACTUALMENTE", en: "CURRENTLY EXPLORING", fr: "EXPLORATION ACTUELLE", it: "ESPLORANDO ORA", pt: "EXPLORANDO AGORA", ko: "현재 탐험 중", zh: "当前探索", he: "חוקר כעת" },
  "cargando...": { es: "Cargando...", en: "Loading...", fr: "Chargement...", it: "Caricamento...", pt: "Carregando...", ko: "로딩 중...", zh: "加载中...", he: "טוען..." },
  "último cache": { es: "Último cache", en: "Last cache", fr: "Dernier cache", it: "Ultima cache", pt: "Último cache", ko: "마지막 캐시", zh: "最近缓存", he: "מטמון אחרון" },
  "local": { es: "LOCAL", en: "LOCAL", fr: "LOCALE", it: "LOCALE", pt: "LOCAL", ko: "현지", zh: "当地", he: "מקומי" },
  "emergencias y seguridad": { es: "Emergencias y Seguridad", en: "Emergencies & Safety", fr: "Urgences et sécurité", it: "Emergenze e sicurezza", pt: "Emergências e segurança", ko: "긴급 상황 및 안전", zh: "紧急情况与安全", he: "חירום ובטיחות" },
  "vida diaria": { es: "Vida diaria", en: "Daily life", fr: "Vie quotidienne", it: "Vita quotidiana", pt: "Vida diária", ko: "일상생활", zh: "日常生活", he: "חיי היומיום" },
  "actualiza tu información personal y preferencias de cuenta.": { es: "Actualiza tu información personal y preferencias de cuenta.", en: "Update your personal information and account preferences.", fr: "Mettez à jour vos informations personnelles et les préférences de votre compte.", it: "Aggiorna le tue informazioni personali e le preferenze del tuo account.", pt: "Atualize suas informações pessoais e preferências da conta.", ko: "개인 정보와 계정 환경설정을 업데이트하세요.", zh: "更新您的个人信息和账户偏好。", he: "עדכן את המידע האישי והעדפות החשבון שלך." },
  "cuenta": { es: "Cuenta", en: "Account", fr: "Compte", it: "Account", pt: "Conta", ko: "계정", zh: "账户", he: "חשבון" },
  "los cambios se guardan automáticamente.": { es: "Los cambios se guardan automáticamente.", en: "Changes are saved automatically.", fr: "Les modifications sont enregistrées automatiquement.", it: "Le modifiche vengono salvate automaticamente.", pt: "As alterações são salvas automaticamente.", ko: "변경 사항은 자동으로 저장됩니다.", zh: "更改会自动保存。", he: "השינויים נשמרים אוטומטית." },
  "ingrese su nombre completo": { es: "Ingrese su nombre completo", en: "Enter your full name", fr: "Saisissez votre nom complet", it: "Inserisci il tuo nome completo", pt: "Digite seu nome completo", ko: "이름을 입력하세요", zh: "输入您的全名", he: "הזן את שמך המלא" },
  "ingrese una nueva contraseña": { es: "Ingrese una nueva contraseña", en: "Enter a new password", fr: "Entrez un nouveau mot de passe", it: "Inserisci una nuova password", pt: "Digite uma nova senha", ko: "새 비밀번호를 입력하세요", zh: "输入新密码", he: "הזן סיסמה חדשה" },
  "cerrar sesión": { es: "Cerrar sesión", en: "Log out", fr: "Se déconnecter", it: "Chiudi sessione", pt: "Sair", ko: "로그아웃", zh: "退出登录", he: "התנתק" },
  "accesos rápidos": { es: "Accesos rápidos", en: "Quick access", fr: "Accès rapides", it: "Accessi rapidi", pt: "Acessos rápidos", ko: "빠른 메뉴", zh: "快速访问", he: "גישה מהירה" },
  "reintentar países": { es: "Reintentar países", en: "Retry countries", fr: "Réessayer les pays", it: "Riprova paesi", pt: "Tentar países novamente", ko: "국가 다시 시도", zh: "重试国家", he: "נסה שוב מדינות" },
};

function fallbackTranslations(languageCode) {
  const translations = new Map();
  Object.entries(UI_TRANSLATIONS).forEach(([source, values]) => {
    translations.set(normalizeText(source), values[languageCode] || values.es || source);
  });
  return translations;
}

function emptyCatalogMaps() {
  return { byId: new Map(), byKey: new Map(), byValue: new Map() };
}

function extractTags(response) {
  const payload = response?.idioma || response?.data?.idioma || response?.data || response;
  return Array.isArray(payload) ? payload : payload?.tags || [];
}

function catalogMaps(response) {
  const maps = emptyCatalogMaps();
  extractTags(response).forEach((tag) => {
    const tagId = Number(tag?.tagId ?? tag?.id);
    const value = typeof tag?.valor === "string" ? tag.valor : "";
    if (!Number.isInteger(tagId) || tagId < 1 || !value) return;

    const record = { tagId, key: tag?.clave || "", value };
    maps.byId.set(tagId, record);
    if (record.key) maps.byKey.set(record.key, record);
    if (!maps.byValue.has(normalizeText(value))) maps.byValue.set(normalizeText(value), record);
  });
  return maps;
}

const runtime = {
  selection: resolveLanguageSelection(DEFAULT_LANGUAGE),
  source: emptyCatalogMaps(),
  target: emptyCatalogMaps(),
  fallback: fallbackTranslations(DEFAULT_LANGUAGE),
  observer: null,
  observerTimer: null,
  applying: false,
  generation: 0,
};

export function localizeCountryName(countryCode, fallback = "", language = runtime.selection.codigoIdioma) {
  const code = String(countryCode || "").trim().toUpperCase();
  if (!code || typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") return fallback;

  try {
    const localized = new Intl.DisplayNames([normalizeLanguageCode(language)], { type: "region" }).of(code);
    return localized || fallback;
  } catch {
    return fallback;
  }
}

const textSources = new WeakMap();
const attributeSources = new WeakMap();
const translationRequests = new Map();

function preserveWhitespace(original, translated) {
  const leading = String(original).match(/^\s*/)?.[0] || "";
  const trailing = String(original).match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}

function elementValue(element) {
  return "placeholder" in element ? element.placeholder : element.textContent || "";
}

function setElementValue(element, value) {
  if ("placeholder" in element) element.placeholder = value;
  else if (!element.children.length) element.textContent = value;
}

function defaultElementValue(element) {
  if (element.dataset.translateDefault === undefined) {
    const markedWithId = element.hasAttribute("data-translate-id");
    element.dataset.translateDefault = markedWithId
      ? elementValue(element)
      : element.dataset.translate || elementValue(element);
  }
  return element.dataset.translateDefault;
}

function resolveElementRecord(element, maps) {
  const rawId = Number(element.dataset.translateId);
  if (Number.isInteger(rawId) && rawId > 0) return maps.byId.get(rawId) || { tagId: rawId, value: "" };

  const key = element.dataset.translateKey;
  if (key && maps.byKey.has(key)) return maps.byKey.get(key);

  const markedText = element.dataset.translate;
  return maps.byValue.get(normalizeText(markedText || defaultElementValue(element)));
}

function rememberTextSource(node) {
  const current = String(node.nodeValue || "");
  const currentNormalized = normalizeText(current);
  let info = textSources.get(node);

  if (!info || (currentNormalized !== info.sourceNormalized && currentNormalized !== info.lastRenderedNormalized)) {
    info = {
      source: current,
      sourceNormalized: currentNormalized,
      lastRendered: current,
      lastRenderedNormalized: currentNormalized,
    };
    textSources.set(node, info);
  }
  return info;
}

function rememberAttributeSource(element, attribute) {
  const current = element.getAttribute(attribute) || "";
  let attributes = attributeSources.get(element);
  if (!attributes) {
    attributes = new Map();
    attributeSources.set(element, attributes);
  }

  let info = attributes.get(attribute);
  const normalized = normalizeText(current);
  if (!info || (normalized !== info.sourceNormalized && normalized !== info.lastRenderedNormalized)) {
    info = {
      source: current,
      sourceNormalized: normalized,
      lastRendered: current,
      lastRenderedNormalized: normalized,
    };
    attributes.set(attribute, info);
  }
  return info;
}

function setTextTranslation(node, info, value) {
  const translated = preserveWhitespace(info.source, value);
  if (node.nodeValue !== translated) node.nodeValue = translated;
  info.lastRendered = translated;
  info.lastRenderedNormalized = normalizeText(translated);
}

function setAttributeTranslation(element, attribute, info, value) {
  if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
  info.lastRendered = value;
  info.lastRenderedNormalized = normalizeText(value);
}

function isIgnoredNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest(
    "script,style,noscript,textarea,select,option,[contenteditable=\"true\"],[data-translate-ignore]",
  ));
}

function isInsideMarkedElement(node) {
  const parent = node.parentElement;
  return Boolean(parent?.closest("[data-translate-id],[data-translate],[data-translate-key]"));
}

function applyMarkedElements(root) {
  const unresolvedLegacy = [];
  const elements = root.querySelectorAll("[data-translate-id],[data-translate],[data-translate-key]");

  elements.forEach((element) => {
    const record = resolveElementRecord(element, runtime.source);
    const targetRecord = record?.tagId ? runtime.target.byId.get(record.tagId) : null;
    const markedSource = element.dataset.translate || element.dataset.translateKey || defaultElementValue(element);
    const fallback = runtime.fallback.get(normalizeText(markedSource));
    const value = targetRecord?.value
      || runtime.source.byId.get(record?.tagId)?.value
      || fallback
      || defaultElementValue(element);

    if ((record?.tagId || fallback) && value) {
      setElementValue(element, value);
    } else if (element.hasAttribute("data-translate") && !element.hasAttribute("data-translate-id")) {
      unresolvedLegacy.push(element);
    }
  });

  return unresolvedLegacy;
}

function applyAutomaticTextTranslations(root) {
  if (typeof document === "undefined" || typeof NodeFilter === "undefined") return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (!isIgnoredNode(node) && !isInsideMarkedElement(node)) {
      const info = rememberTextSource(node);
      const sourceRecord = runtime.source.byValue.get(info.sourceNormalized);
      const targetRecord = sourceRecord?.tagId ? runtime.target.byId.get(sourceRecord.tagId) : null;
      const fallback = runtime.fallback.get(info.sourceNormalized);
      if (sourceRecord && targetRecord?.value) setTextTranslation(node, info, targetRecord.value);
      else if (fallback) setTextTranslation(node, info, fallback);
      else if (sourceRecord && runtime.selection.idiomaId === DEFAULT_LANGUAGE_ID) setTextTranslation(node, info, sourceRecord.value);
    }
    node = walker.nextNode();
  }
}

function applyAutomaticAttributeTranslations(root) {
  const elements = root.querySelectorAll("[placeholder],[aria-label],[title],[alt]");
  elements.forEach((element) => {
    ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const info = rememberAttributeSource(element, attribute);
      const sourceRecord = runtime.source.byValue.get(info.sourceNormalized);
      const targetRecord = sourceRecord?.tagId ? runtime.target.byId.get(sourceRecord.tagId) : null;
      const fallback = runtime.fallback.get(info.sourceNormalized);
      if (sourceRecord && targetRecord?.value) setAttributeTranslation(element, attribute, info, targetRecord.value);
      else if (fallback) setAttributeTranslation(element, attribute, info, fallback);
      else if (sourceRecord && runtime.selection.idiomaId === DEFAULT_LANGUAGE_ID) setAttributeTranslation(element, attribute, info, sourceRecord.value);
    });
  });
}

function applyCountryNameTranslations(root) {
  root.querySelectorAll("[data-country-code]").forEach((element) => {
    if (element.children.length) return;
    const fallback = element.textContent || "";
    const value = localizeCountryName(element.dataset.countryCode, fallback);
    if (value && value !== element.textContent) element.textContent = value;
  });
}

function translateLegacyElements(elements) {
  if (runtime.selection.idiomaId === DEFAULT_LANGUAGE_ID || !elements.length) return;

  const texts = elements.map((element) => element.dataset.translate || defaultElementValue(element));
  const requestKey = `${runtime.selection.codigoIdioma}:${texts.join("\u0000")}`;
  if (translationRequests.has(requestKey)) return translationRequests.get(requestKey);

  const request = translateBatch({
    texts,
    sourceLanguage: DEFAULT_LANGUAGE,
    targetLanguage: runtime.selection.codigoIdioma,
  }).then((payload) => {
    if (payload?.success === false) throw new Error(CONNECTION_ERROR_MESSAGE);
    const translations = payload.data?.translations || payload.data?.translatedTexts || payload.translations || payload.translatedTexts || [];
    runtime.applying = true;
    elements.forEach((element, index) => {
      if (translations[index]) setElementValue(element, translations[index]);
    });
    runtime.applying = false;
  }).finally(() => {
    translationRequests.delete(requestKey);
  });

  translationRequests.set(requestKey, request);
  return request;
}

function applyDocumentTranslations() {
  if (typeof document === "undefined") return;
  const root = document.getElementById("root") || document.body;
  if (!root) return;

  runtime.applying = true;
  const unresolvedLegacy = applyMarkedElements(root);
  applyAutomaticTextTranslations(root);
  applyAutomaticAttributeTranslations(root);
  applyCountryNameTranslations(root);
  runtime.applying = false;

  void translateLegacyElements(unresolvedLegacy).catch(() => {});
}

function scheduleDocumentTranslations() {
  if (runtime.observerTimer || typeof window === "undefined") return;
  runtime.observerTimer = window.setTimeout(() => {
    runtime.observerTimer = null;
    if (!runtime.applying) applyDocumentTranslations();
  }, 0);
}

function ensureTranslationObserver() {
  if (runtime.observer || typeof MutationObserver === "undefined" || typeof document === "undefined") return;
  const root = document.getElementById("root");
  if (!root) return;

  runtime.observer = new MutationObserver(() => {
    if (!runtime.applying) scheduleDocumentTranslations();
  });
  runtime.observer.observe(root, { childList: true, subtree: true, characterData: true });
}

export async function translatePage(language = DEFAULT_LANGUAGE) {
  const selection = resolveLanguageSelection(language);
  const generation = ++runtime.generation;
  const targetPromise = getLanguageTags(selection.idiomaId);
  const sourcePromise = selection.idiomaId === DEFAULT_LANGUAGE_ID
    ? targetPromise
    : getLanguageTags(DEFAULT_LANGUAGE_ID);
  const [targetResult, sourceResult] = await Promise.allSettled([targetPromise, sourcePromise]);

  if (generation !== runtime.generation) return selection.codigoIdioma;

  const targetMaps = targetResult.status === "fulfilled" ? catalogMaps(targetResult.value) : emptyCatalogMaps();
  const sourceMaps = selection.idiomaId === DEFAULT_LANGUAGE_ID
    ? targetMaps
    : sourceResult.status === "fulfilled" ? catalogMaps(sourceResult.value) : runtime.source;

  runtime.selection = selection;
  runtime.source = sourceMaps;
  runtime.target = targetMaps;
  runtime.fallback = fallbackTranslations(selection.codigoIdioma);
  document.documentElement.lang = selection.codigoIdioma;
  ensureTranslationObserver();
  applyDocumentTranslations();
  return selection.codigoIdioma;
}
