import { SESSION_ID, getCurrentLang } from './state.js';

// ---- AI ASSISTANT POPUP ----
const aiToggle = document.getElementById('ai-toggle');
const aiPopup = document.getElementById('ai-popup');
const aiClose = document.getElementById('ai-close');

if (aiToggle && aiPopup) {
  aiToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    // Clear any inline style set by the close button fallback
    aiPopup.style.display = '';
    const isActive = aiPopup.classList.toggle('active');
    if (isActive) {
      aiPopup.setAttribute('aria-modal', 'true');
      setTimeout(() => {
        const inp = document.getElementById('chat-input');
        if (inp) inp.focus();
      }, 100);

      // Focus trap
      const focusableElements = aiPopup.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      aiPopup.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // shift + tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            // tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    } else {
      aiPopup.removeAttribute('aria-modal');
      aiToggle.focus();
    }
  });
}

if (aiClose && aiPopup) {
  aiClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked');
    aiPopup.classList.remove('active');
    aiPopup.removeAttribute('aria-modal');
    // Force direct style if class toggle fails
    aiPopup.style.display = 'none';
    aiToggle.focus();
  });
}

// Close popup on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aiPopup && aiPopup.classList.contains('active')) {
    aiPopup.classList.remove('active');
    aiToggle.focus();
  }
});

// ---- CHAT ----
function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(role, text) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  const avatar = role === 'bot' ? '🤖' : '👤';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">${avatar}</div>
    <div class="msg-content">
      ${role === 'bot' ? (typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`) : `<p>${text}</p>`}
      <span class="msg-time" aria-label="Sent at ${getTime()}">${getTime()}</span>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'message bot typing-indicator';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-content">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendChat(message) {
  if (!message.trim()) return;
  appendMessage('user', message);
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': SESSION_ID,
      },
      body: JSON.stringify({ message, lang: getCurrentLang() }),
    });
    const data = await res.json();
    removeTyping();
    if (data.reply) {
      appendMessage('bot', data.reply);
    } else {
      appendMessage('bot', 'Sorry, I could not get a response. Please try again.');
    }
  } catch {
    removeTyping();
    appendMessage('bot', 'Network error. Please check your connection and try again.');
  }
}

let sendTimer;
function handleSend() {
  const inp = document.getElementById('chat-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;

  clearTimeout(sendTimer);
  sendTimer = setTimeout(() => {
    sendChat(text);
    inp.value = '';
    inp.focus();
  }, 100);
}

const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
if (chatSend) chatSend.addEventListener('click', handleSend);
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

document.querySelectorAll('.quick-btn').forEach((btn) => {
  btn.addEventListener('click', () => sendChat(btn.dataset.q));
});

// Load chat history on page load
async function loadHistory() {
  try {
    const res = await fetch('/api/history', {
      headers: { 'x-session-id': SESSION_ID },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      data.slice(-5).forEach((entry) => {
        if (entry.userMessage) appendMessage('user', entry.userMessage);
        if (entry.botReply) appendMessage('bot', entry.botReply);
      });
    }
  } catch {
    /* graceful degradation */
  }
}
loadHistory();

export { loadHistory };
