import { getCurrentLang, setCurrentLang } from './state.js';
import { TIMELINE_DATA, DEFAULT_TIMELINE_DATA, STATIC_UI_BASE, setTimelineData } from './data.js';
import { renderTimeline, activeCountry } from './timeline.js';
import { loadHistory } from './chat.js';

// ---- SESSION & LANGUAGE MANAGEMENT ----

// Original English data to fall back on

// Update UI to match stored language
document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = getCurrentLang();
    langSelect.addEventListener('change', async (e) => {
      setCurrentLang(e.target.value);
      localStorage.setItem('electiq_lang', getCurrentLang());
      await updateStaticUI(getCurrentLang());
      loadHistory();
    });
  }
  // Apply current lang on load
  if (getCurrentLang() !== 'en') updateStaticUI(getCurrentLang());
});

async function updateStaticUI(lang) {
  if (lang === 'en') {
    // Reset to defaults
    Object.assign(TIMELINE_DATA, JSON.parse(JSON.stringify(DEFAULT_TIMELINE_DATA)));
    Object.entries(STATIC_UI_BASE).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    });
    renderTimeline(activeCountry);
    return;
  }

  // Check cache
  const cacheKey = `ui_cache_${lang}`;
  let cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { staticTexts, timelineData } = JSON.parse(cached);
    applyTranslatedUI(staticTexts, timelineData);
  } else {
    try {
      // Bulk translate
      const res = await fetch('/api/translate-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: STATIC_UI_BASE, lang }),
      });
      const data = await res.json();

      const staticTexts = data.items;
      const timelineData = await translateTimeline(lang);

      localStorage.setItem(cacheKey, JSON.stringify({ staticTexts, timelineData }));
      applyTranslatedUI(staticTexts, timelineData);
    } catch (err) {
      console.error('Translation error:', err);
    }
  }
}

function applyTranslatedUI(staticTexts, timelineData) {
  Object.entries(staticTexts).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  });

  if (timelineData) {
    Object.assign(TIMELINE_DATA, timelineData);
    renderTimeline(activeCountry);
  }
}

async function translateTimeline(lang) {
  // Flattens timeline for translation
  const stepsToTranslate = [];
  const pathMap = [];

  Object.entries(DEFAULT_TIMELINE_DATA).forEach(([country, steps]) => {
    steps.forEach((step, i) => {
      stepsToTranslate.push(step.name, step.duration, step.description);
      pathMap.push({ country, i, fields: ['name', 'duration', 'description'] });
    });
  });

  const res = await fetch('/api/translate-ui', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: stepsToTranslate.reduce((acc, text, index) => ({ ...acc, [index]: text }), {}),
      lang,
    }),
  });
  const data = await res.json();

  const newTimeline = JSON.parse(JSON.stringify(DEFAULT_TIMELINE_DATA));
  let count = 0;
  Object.entries(newTimeline).forEach(([country, steps]) => {
    steps.forEach((step, i) => {
      step.name = data.items[count++];
      step.duration = data.items[count++];
      step.description = data.items[count++];
    });
  });
  return newTimeline;
}

// ---- MOBILE NAV TOGGLE ----
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
  });

  // Close nav on link click
  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
    });
  });
}
