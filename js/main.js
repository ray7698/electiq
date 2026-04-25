import './state.js';
import './data.js';
import './timeline.js';
import './chat.js';
import './quiz.js';
import './map.js';
import './ui.js';

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('Service Worker registered', reg))
      .catch((err) => console.warn('Service Worker registration failed', err));
  });
}
