"use strict";

const MAX_BUBBLES = 10;
const INITIAL_BUBBLES = 10;
const STOP_WORDS = new Set(
  "about after again against also among another because been before being between both could does doing down during each from further have having here into itself just more most much must only other over same should some such than that their them then there these they this those through under very what when where which while who whom will with would your known became first later many most part used were whose include including however often called made make since until upon within without early years year people city country born died death located largest second world american english north south east west film television".split(" "),
);

const cloud = document.querySelector("#bubble-cloud");
const sentenceStage = document.querySelector("#sentence-stage");
const articleGrid = document.querySelector("#article-grid");
const articleTitle = document.querySelector("#article-title");
const shuffleButton = document.querySelector("#shuffle-button");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalClose = document.querySelector("#modal-close");
const modalTitle = document.querySelector("#modal-title");
const modalCopy = document.querySelector("#modal-copy");
const wikipediaLink = document.querySelector("#wikipedia-link");
const installButton = document.querySelector("#install-button");
const installBackdrop = document.querySelector("#install-backdrop");
const installClose = document.querySelector("#install-close");
const installIntro = document.querySelector("#install-intro");
const installSteps = document.querySelector("#install-steps");

let articles = [];
let sentenceRecords = [];
let sentenceIndex = new Map();
let initialWordPool = [];
let bubbles = [];
let suggestions = [];
let discovery = null;
let activeWord = null;
let popping = false;
let nextId = INITIAL_BUBBLES + 1;
let nextBorn = INITIAL_BUBBLES + 1;
const motionStates = new Map();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isSafariBrowser = /safari/i.test(navigator.userAgent)
  && !/chrome|crios|edg|fxios|opr/i.test(navigator.userAgent);
const isMacSafari = isSafariBrowser && /macintosh/i.test(navigator.userAgent) && !isAppleMobile;
const isInstalled = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
let deferredInstallPrompt = null;

function renderInstallInstructions() {
  const macSteps = [
    ["Click Share", "Use the Share button in Safari’s toolbar."],
    ["Choose “Add to Dock”", "Safari will prepare Wiki Pop! as a web app."],
    ["Click Add", "The app will appear in the Dock and Spotlight."],
  ];
  const mobileSteps = [
    ["Tap Share", "Use the square with the upward arrow."],
    ["Choose “Add to Home Screen”", "Scroll down if it is not immediately visible."],
    ["Turn on “Open as Web App,” then tap Add", "Wiki Pop! will appear with your other apps."],
  ];
  const steps = isMacSafari ? macSteps : mobileSteps;

  installIntro.textContent = isMacSafari
    ? "Safari can add Wiki Pop! to your Mac’s Dock:"
    : "On iPhone and iPad, Safari installs web apps from the Share menu:";
  installSteps.replaceChildren();
  steps.forEach(([title, detail], index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1);
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = detail;
    item.append(number, strong, small);
    installSteps.append(item);
  });
}

function openInstallInstructions() {
  installBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  installClose.focus();
}

function closeInstallInstructions() {
  installBackdrop.hidden = true;
  document.body.style.overflow = "";
  installButton.focus();
}

async function installApp() {
  if (!deferredInstallPrompt) {
    openInstallInstructions();
    return;
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  if (choice.outcome === "accepted") installButton.hidden = true;
}

function configureInstallExperience() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => console.error("Service worker registration failed", error));
    });
  }

  if (isInstalled) return;
  if (isAppleMobile || isMacSafari) {
    renderInstallInstructions();
    installButton.hidden = false;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });
}

function wordsFrom(sentence) {
  const matches = sentence.match(/[A-Za-z][A-Za-z'-]{3,14}/g) || [];
  return Array.from(
    new Set(
      matches
        .map((word) => word.replace(/^['-]+|['-]+$/g, ""))
        .filter((word) => word.length >= 4 && !STOP_WORDS.has(word.toLowerCase())),
    ),
  );
}

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function displayWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function unitFrom(seed) {
  return Math.abs(Math.sin(seed * 999.91) * 43758.5453) % 1;
}

function bubbleMetrics(bubble) {
  const label = displayWord(bubble.word);
  const size = 100 + ((bubble.word.length * 11 + bubble.id * 17) % 42);
  const fontSize = Math.max(8.5, Math.min(18, (size - 30) / (label.length * 0.59)));
  return { size, fontSize };
}

function relatedArticlesFor(word, record) {
  const key = word.toLowerCase();
  const contextWords = new Set(wordsFrom(record.sentence).map((item) => item.toLowerCase()));
  const directMap = new Map();

  for (const item of sentenceIndex.get(key) || []) {
    if (item.article.slug !== record.article.slug) directMap.set(item.article.slug, item.article);
  }
  const directArticles = shuffled(Array.from(directMap.values()));

  const scoredArticles = articles
    .filter(
      (article) => article.slug !== record.article.slug && !directMap.has(article.slug),
    )
    .map((article) => {
      const articleWords = new Set(
        wordsFrom(`${article.title} ${article.sentences.join(" ")}`).map((item) => item.toLowerCase()),
      );
      let score = 0;
      for (const contextWord of contextWords) {
        if (articleWords.has(contextWord)) score += 1;
      }
      if (article.title.toLowerCase().includes(key)) score += 24;
      if (
        article.sentences.some((sentence) =>
          wordsFrom(sentence).some((item) => item.toLowerCase() === key),
        )
      ) {
        score += 14;
      }
      return { article, score: score + Math.random() * 1.5 };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);

  const result = new Map();
  for (const article of [record.article, ...directArticles, ...scoredArticles]) {
    if (!result.has(article.slug)) result.set(article.slug, article);
    if (result.size === 3) break;
  }
  return Array.from(result.values());
}

function makeBubbleElement(bubble, isNew) {
  const { size, fontSize } = bubbleMetrics(bubble);
  const button = document.createElement("button");
  button.className = `word-bubble color-${bubble.color}${isNew ? " is-new" : ""}`;
  button.type = "button";
  button.dataset.bubbleId = String(bubble.id);
  button.setAttribute("aria-label", `Pop the word ${displayWord(bubble.word)}`);
  button.style.setProperty("--bubble-size", `${size}px`);
  button.style.setProperty("--word-size", `${fontSize}px`);
  button.style.setProperty("--bubble-rotate", `${(bubble.id % 7) - 3}deg`);

  const face = document.createElement("span");
  face.className = "bubble-face";
  const word = document.createElement("span");
  word.className = "bubble-word";
  word.textContent = displayWord(bubble.word);
  face.append(word);
  button.append(face);
  button.addEventListener("click", () => popBubble(bubble, button));
  cloud.append(button);

  const maxX = Math.max(0, cloud.clientWidth - size);
  const maxY = Math.max(0, cloud.clientHeight - size);
  const motion = {
    element: button,
    size,
    x: unitFrom(bubble.id * 3.17) * maxX,
    y: unitFrom(bubble.id * 7.43) * maxY,
    velocityX: (24 + unitFrom(bubble.id * 5.11) * 28) * (bubble.id % 2 ? 1 : -1),
    velocityY: (20 + unitFrom(bubble.id * 9.71) * 25) * (bubble.id % 3 ? 1 : -1),
  };
  motionStates.set(bubble.id, motion);
  placeMotion(motion);
}

function placeMotion(motion) {
  motion.element.style.transform = `translate3d(${motion.x}px, ${motion.y}px, 0)`;
  motion.element.dataset.ready = "true";
}

function renderBubbles(newIds = new Set()) {
  const liveIds = new Set(bubbles.map((bubble) => bubble.id));
  for (const [id, motion] of motionStates) {
    if (!liveIds.has(id)) {
      motion.element.remove();
      motionStates.delete(id);
    }
  }

  for (const bubble of bubbles) {
    if (!motionStates.has(bubble.id)) makeBubbleElement(bubble, newIds.has(bubble.id));
  }
}

let previousFrame = performance.now();
function animateBubbles(time) {
  const elapsed = Math.min((time - previousFrame) / 1000, 0.04);
  previousFrame = time;

  for (const motion of motionStates.values()) {
    const maxX = Math.max(0, cloud.clientWidth - motion.size);
    const maxY = Math.max(0, cloud.clientHeight - motion.size);
    motion.x += motion.velocityX * elapsed;
    motion.y += motion.velocityY * elapsed;

    if (motion.x <= 0 || motion.x >= maxX) {
      motion.x = Math.max(0, Math.min(maxX, motion.x));
      motion.velocityX *= -1;
    }
    if (motion.y <= 0 || motion.y >= maxY) {
      motion.y = Math.max(0, Math.min(maxY, motion.y));
      motion.velocityY *= -1;
    }
    placeMotion(motion);
  }
  window.requestAnimationFrame(animateBubbles);
}

function renderSentence() {
  sentenceStage.replaceChildren();
  sentenceStage.classList.toggle("has-discovery", Boolean(discovery));
  if (!discovery) return;

  const label = document.createElement("div");
  label.className = "sentence-label";
  const spark = document.createElement("span");
  spark.className = "pop-spark";
  spark.setAttribute("aria-hidden", "true");
  spark.textContent = "✦";
  label.append(spark, document.createTextNode("You popped "));
  const strong = document.createElement("strong");
  strong.textContent = displayWord(activeWord);
  label.append(strong);

  const quote = document.createElement("blockquote");
  quote.textContent = discovery.sentence;
  const origin = document.createElement("button");
  origin.className = "article-origin";
  origin.type = "button";
  origin.append(document.createTextNode("From "));
  const originTitle = document.createElement("strong");
  originTitle.textContent = discovery.article.title;
  origin.append(originTitle, document.createTextNode(" ↗"));
  origin.addEventListener("click", () => openArticle(discovery.article));

  const hint = document.createElement("p");
  hint.className = "next-hint";
  hint.textContent = "Fresh words from this sentence just floated into your sky.";
  sentenceStage.append(label, quote, origin, hint);
}

function renderArticles() {
  articleGrid.replaceChildren();
  articleTitle.replaceChildren();
  if (activeWord) {
    articleTitle.append(document.createTextNode("Related to "));
    const word = document.createElement("span");
    word.className = "related-word";
    word.textContent = `“${displayWord(activeWord)}”`;
    articleTitle.append(word);
  } else {
    articleTitle.textContent = "Three doors into Wikipedia";
  }

  suggestions.forEach((article, index) => {
    const card = document.createElement("button");
    card.className = `article-card card-${index}`;
    card.type = "button";
    card.addEventListener("click", () => openArticle(article));

    const number = document.createElement("span");
    number.className = "article-number";
    number.textContent = `0${index + 1}`;
    const category = document.createElement("span");
    category.className = "article-category";
    category.textContent = activeWord ? `Related to ${displayWord(activeWord)}` : "Random article";
    const title = document.createElement("strong");
    title.textContent = article.title;
    const preview = document.createElement("span");
    preview.className = "article-preview";
    preview.textContent = article.sentences[0];
    const open = document.createElement("span");
    open.className = "open-label";
    open.textContent = "Open article ↗";
    card.append(number, category, title, preview, open);
    articleGrid.append(card);
  });
}

function popBubble(bubble, element) {
  if (popping) return;
  popping = true;
  element.classList.add("is-popping");

  window.setTimeout(() => {
    const choices = sentenceIndex.get(bubble.word.toLowerCase()) || [];
    const record = choices.length ? randomItem(choices) : randomItem(sentenceRecords);
    const newWords = shuffled(wordsFrom(record.sentence))
      .filter((word) => word.toLowerCase() !== bubble.word.toLowerCase())
      .slice(0, 7);
    const additions = newWords.map((word) => ({
      id: nextId++,
      word,
      born: nextBorn++,
      color: Math.floor(Math.random() * 6),
    }));

    discovery = record;
    activeWord = bubble.word;
    suggestions = relatedArticlesFor(activeWord, discovery);
    bubbles = bubbles
      .filter((item) => item.id !== bubble.id)
      .concat(additions)
      .sort((a, b) => a.born - b.born)
      .slice(-MAX_BUBBLES);

    renderBubbles(new Set(additions.map((item) => item.id)));
    renderSentence();
    renderArticles();
    popping = false;
  }, 230);
}

function openArticle(article) {
  modalTitle.textContent = article.title;
  modalCopy.replaceChildren();
  for (const sentence of article.sentences) {
    const paragraph = document.createElement("p");
    paragraph.textContent = sentence;
    modalCopy.append(paragraph);
  }
  wikipediaLink.href = `https://simple.wikipedia.org/wiki/${encodeURIComponent(article.slug)}`;
  modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeArticle() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

shuffleButton.addEventListener("click", () => {
  suggestions = activeWord && discovery
    ? relatedArticlesFor(activeWord, discovery)
    : shuffled(articles).slice(0, 3);
  renderArticles();
});
modalClose.addEventListener("click", closeArticle);
modalBackdrop.addEventListener("mousedown", (event) => {
  if (event.target === modalBackdrop) closeArticle();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalBackdrop.hidden) closeArticle();
  if (event.key === "Escape" && !installBackdrop.hidden) closeInstallInstructions();
});
installButton.addEventListener("click", installApp);
installClose.addEventListener("click", closeInstallInstructions);
installBackdrop.addEventListener("mousedown", (event) => {
  if (event.target === installBackdrop) closeInstallInstructions();
});

async function initialize() {
  try {
    const response = await fetch("./data/kiwix-simple.json");
    if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
    const data = await response.json();
    articles = data.articles;
    sentenceRecords = articles.flatMap((article) =>
      article.sentences.map((sentence) => ({ article, sentence })),
    );
    sentenceIndex = new Map();
    for (const record of sentenceRecords) {
      for (const word of wordsFrom(record.sentence)) {
        const key = word.toLowerCase();
        const group = sentenceIndex.get(key) || [];
        group.push(record);
        sentenceIndex.set(key, group);
      }
    }
    initialWordPool = Array.from(sentenceIndex.entries())
      .filter(([word, records]) => word.length >= 5 && records.length >= 2 && records.length <= 45)
      .map(([word]) => word);

    bubbles = shuffled(initialWordPool).slice(0, INITIAL_BUBBLES).map((word, index) => ({
      id: index + 1,
      word,
      born: index + 1,
      color: Math.floor(Math.random() * 6),
    }));
    suggestions = shuffled(articles).slice(0, 3);
    cloud.setAttribute("aria-busy", "false");
    renderBubbles();
    renderArticles();
    if (!reducedMotion) window.requestAnimationFrame(animateBubbles);
  } catch (error) {
    cloud.setAttribute("aria-busy", "false");
    const message = document.createElement("p");
    message.className = "load-error";
    message.textContent = "The word sky could not load. Please refresh and try again.";
    cloud.append(message);
    console.error(error);
  }
}

configureInstallExperience();
initialize();
