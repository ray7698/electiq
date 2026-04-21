// ====================================================
// ElectIQ — Frontend Application Logic
// ====================================================

// ---- TIMELINE DATA ----
const TIMELINE_DATA = {
  india: [
    {
      icon: "📝", name: "Voter Registration", duration: "Ongoing / before cutoff",
      description: "Citizens 18+ can register on the Electoral Roll via the Election Commission of India. Registration is free and mandatory to vote.",
      keyRules: "Must be 18+ on the qualifying date. Register at your local ERO or online at voters.eci.gov.in.",
      citizenDuty: "Check if you're registered. Update address if moved. Help family members register.",
      typicalTimeline: "Rolls are updated quarterly. Final roll published 4 weeks before election."
    },
    {
      icon: "📣", name: "Election Announcement", duration: "45–90 days before voting",
      description: "The Election Commission announces the election schedule, triggering the Model Code of Conduct (MCC) immediately.",
      keyRules: "Once MCC kicks in, the ruling party cannot announce new schemes or use government resources for campaigning.",
      citizenDuty: "Note important dates: nomination deadline, voting day, result day.",
      typicalTimeline: "Schedule announced 4–6 weeks before first phase of voting."
    },
    {
      icon: "🎫", name: "Candidate Nomination", duration: "2 weeks",
      description: "Candidates file nomination papers with the Returning Officer. Papers are scrutinised and withdrawal deadline follows.",
      keyRules: "Must be an Indian citizen, 25+ for Lok Sabha. Pay a security deposit (₹25,000 for general, ₹12,500 for SC/ST).",
      citizenDuty: "Research candidates filing in your constituency. Check their affidavits on ECI website.",
      typicalTimeline: "Nominations open ~2 weeks after announcement. Withdrawal deadline 2 days after scrutiny."
    },
    {
      icon: "📢", name: "Campaign Period", duration: "2–4 weeks",
      description: "Candidates and parties campaign through rallies, advertisements, and door-to-door visits. Strictly governed by MCC.",
      keyRules: "Campaign ends 48 hours before polling (silence period). Cash distribution or bribing voters is illegal.",
      citizenDuty: "Attend public meetings. Read manifestos. Verify claims using fact-checkers.",
      typicalTimeline: "Active campaigning for 3–4 weeks. Silence period 48 hours before voting."
    },
    {
      icon: "🗳", name: "Voting Day", duration: "1 day (multiple phases)",
      description: "Eligible voters cast their ballot at their designated polling booth using Electronic Voting Machines (EVMs).",
      keyRules: "Carry valid photo ID (Voter ID, Aadhaar, Passport etc.). Voting is secret. You get an indelible ink mark.",
      citizenDuty: "Find your booth at voters.eci.gov.in. Carry your Voter ID. Vote early to avoid queues.",
      typicalTimeline: "Polls open 7am–6pm. Large states vote in multiple phases over several weeks."
    },
    {
      icon: "🏆", name: "Results & Declaration", duration: "1–2 days after last phase",
      description: "Votes counted at counting centres under strict security. Results declared constituency-by-constituency.",
      keyRules: "Winning candidate gets simple majority (FPTP). President invites largest party/coalition to form government.",
      citizenDuty: "Follow results on ECI website. Understand coalition-formation if no single majority.",
      typicalTimeline: "Counting begins at 8am on result day. Full results usually by evening."
    },
  ],
  us: [
    {
      icon: "📝", name: "Voter Registration", duration: "Varies by state",
      description: "US citizens register to vote at the state level. Deadlines vary — some states allow same-day registration.",
      keyRules: "Must be a US citizen, 18+ by Election Day. Felony convictions may restrict rights in some states.",
      citizenDuty: "Register at vote.gov. Check your state's deadline — typically 15–30 days before election.",
      typicalTimeline: "Register well in advance. Deadlines range from 30 days to Election Day depending on state."
    },
    {
      icon: "🎪", name: "Primaries & Caucuses", duration: "Feb – June (election year)",
      description: "Voters choose party nominees through state-by-state primaries. Results determine delegates to the national convention.",
      keyRules: "Open vs closed primaries vary by state. Super Tuesday is the biggest single primary day.",
      citizenDuty: "Participate in your party primary. Presidential candidates are chosen here.",
      typicalTimeline: "Iowa caucuses traditionally first (Jan/Feb). Primaries run through June."
    },
    {
      icon: "🏟", name: "National Conventions", duration: "July – August",
      description: "Each major party officially nominates its presidential and vice-presidential candidates at a national convention.",
      keyRules: "Delegates cast votes to formally nominate. Party platform is adopted.",
      citizenDuty: "Watch conventions to understand each party's platform and priorities.",
      typicalTimeline: "Republican and Democratic conventions held in summer of election year."
    },
    {
      icon: "📢", name: "General Campaign", duration: "Sept – Nov",
      description: "Presidential and congressional candidates campaign nationally. Presidential debates are held in September/October.",
      keyRules: "Campaign finance limits apply. Foreign interference is illegal. FEC regulates spending.",
      citizenDuty: "Watch presidential debates. Research down-ballot candidates (Senate, House, local).",
      typicalTimeline: "General campaign intensifies after Labor Day. Debates held in Sept/Oct."
    },
    {
      icon: "🗳", name: "Election Day", duration: "First Tuesday after first Monday in November",
      description: "Citizens vote in-person or by mail/absentee ballot. Polls open and close at state-specific times.",
      keyRules: "Electoral College system — 270 electoral votes needed to win presidency. Popular vote decides each state.",
      citizenDuty: "Check polling place at usa.gov. Many states allow early voting and mail-in ballots.",
      typicalTimeline: "Election Day is fixed. Early voting begins weeks earlier in most states."
    },
    {
      icon: "🏛", name: "Electoral College & Inauguration", duration: "Dec – Jan",
      description: "Electors meet in December to cast official votes. Congress certifies in January. Inauguration on Jan 20.",
      keyRules: "270 electoral votes required. Most states are winner-take-all. Maine and Nebraska split proportionally.",
      citizenDuty: "Understand your state's electors. Inauguration marks the official transfer of power.",
      typicalTimeline: "Electors vote in December. Congress certifies Jan 6. Inauguration Jan 20."
    },
  ],
  uk: [
    {
      icon: "📝", name: "Electoral Registration", duration: "Ongoing",
      description: "UK citizens and qualifying residents register to vote individually online or by post through their local council.",
      keyRules: "Must be 18+ on polling day (16+ in Scotland/Wales for devolved elections). British, Irish, or qualifying Commonwealth citizen.",
      citizenDuty: "Register at gov.uk/register-to-vote. Check registration before each election.",
      typicalTimeline: "Registration deadline typically 12 working days before polling day."
    },
    {
      icon: "📣", name: "Dissolution & Announcement", duration: "25 working days before election",
      description: "Parliament is dissolved and an election is called. The formal election period begins with the issue of writs.",
      keyRules: "Fixed-term Parliament Act sets 5-year terms, but early elections can be called. Purdah restrictions apply to government.",
      citizenDuty: "Note the polling date. Request postal vote if needed — deadline is 11 working days before.",
      typicalTimeline: "25 working days between dissolution and polling day (minimum)."
    },
    {
      icon: "🎫", name: "Candidate Nominations", duration: "First week",
      description: "Candidates submit nomination papers signed by 10 registered electors plus a £500 deposit.",
      keyRules: "Must be a British citizen or qualifying Commonwealth/Irish citizen. Age 18+. Deposit returned if 5%+ votes received.",
      citizenDuty: "Check who is standing in your constituency at electoralcommission.org.uk.",
      typicalTimeline: "Nominations close approximately 19 working days before polling day."
    },
    {
      icon: "📢", name: "Short Campaign Period", duration: "~3 weeks",
      description: "Intense campaigning with spending limits strictly enforced. TV debates, leaflets, canvassing and digital advertising.",
      keyRules: "Campaign spending limits per constituency: ~£15,000 + per-elector amount. Imprint required on all campaign materials.",
      citizenDuty: "Read manifestos. Attend hustings. Use tactical voting tools if relevant to your constituency.",
      typicalTimeline: "Campaigning intensifies in the final 3 weeks. Media blackout on election day itself."
    },
    {
      icon: "🗳", name: "Polling Day", duration: "One day: 7am – 10pm",
      description: "Voters attend their designated polling station and mark their ballot paper with an X for one candidate.",
      keyRules: "Photo ID required since 2023. First-Past-The-Post system: highest vote-getter wins each constituency.",
      citizenDuty: "Bring accepted photo ID (driving licence, passport, voter ID card). Find your polling station on your poll card.",
      typicalTimeline: "Polls open 7am to 10pm. Exit poll published at 10pm. Results through the night."
    },
    {
      icon: "🏆", name: "Results & New Government", duration: "Overnight into next day",
      description: "Local counts declare constituency results through the night. Party with most seats forms the government.",
      keyRules: "326+ seats needed for a majority. If hung parliament, coalition or confidence-and-supply agreements are negotiated.",
      citizenDuty: "Follow results live. New PM appointed by the King typically the day after polling day.",
      typicalTimeline: "Most seats declared overnight. Final seat often by mid-morning. PM appointed next day."
    },
  ]
};

// ---- THEME TOGGLE ----
const savedTheme = localStorage.getItem('electiq-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('electiq-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

// ---- TIMELINE ----
let activeCountry = 'india';
let activeStep = null;

function renderTimeline(country) {
  const steps = TIMELINE_DATA[country];
  const container = document.getElementById('timeline-steps');
  container.innerHTML = steps.map((step, i) => `
    <div class="timeline-step${activeStep === i ? ' active' : ''}"
      role="listitem"
      tabindex="0"
      aria-label="${step.name} — ${step.duration}"
      data-index="${i}"
      onclick="selectStep(${i})"
      onkeydown="if(event.key==='Enter'||event.key===' ')selectStep(${i})">
      <div class="step-num" aria-hidden="true">${i + 1}</div>
      <div class="step-icon" aria-hidden="true">${step.icon}</div>
      <div class="step-name">${step.name}</div>
      <div class="step-duration">${step.duration}</div>
    </div>
  `).join('');
}

function selectStep(i) {
  const steps = TIMELINE_DATA[activeCountry];
  const step = steps[i];
  activeStep = i;
  renderTimeline(activeCountry);

  const detail = document.getElementById('timeline-detail');
  const content = document.getElementById('timeline-detail-content');
  content.innerHTML = `
    <h3 class="detail-title">${step.icon} ${step.name}</h3>
    <p style="color:var(--text-muted);font-size:14px;margin-bottom:4px">${step.description}</p>
    <div class="detail-grid">
      <div class="detail-card">
        <div class="detail-card-title">⏱ Typical Timeline</div>
        <div class="detail-card-body">${step.typicalTimeline}</div>
      </div>
      <div class="detail-card">
        <div class="detail-card-title">📜 Key Rules</div>
        <div class="detail-card-body">${step.keyRules}</div>
      </div>
      <div class="detail-card" style="grid-column:1/-1">
        <div class="detail-card-title">✅ Your Civic Duty</div>
        <div class="detail-card-body">${step.citizenDuty}</div>
      </div>
    </div>
  `;
  detail.hidden = false;
  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('detail-close').addEventListener('click', () => {
  document.getElementById('timeline-detail').hidden = true;
  activeStep = null;
  renderTimeline(activeCountry);
});

document.querySelectorAll('.etab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.etab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeCountry = btn.dataset.country;
    activeStep = null;
    document.getElementById('timeline-detail').hidden = true;
    renderTimeline(activeCountry);
  });
});

renderTimeline('india');

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
      <p>${text}</p>
      <span class="msg-time" aria-label="Sent at ${getTime()}">${getTime()}</span>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg bot typing';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="msg-avatar" aria-hidden="true">🤖</div>
    <div class="msg-content" aria-label="ElectIQ is typing">
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
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

// Debounced send
let sendTimer;
document.getElementById('chat-send').addEventListener('click', () => {
  const inp = document.getElementById('chat-input');
  clearTimeout(sendTimer);
  sendTimer = setTimeout(() => {
    sendChat(inp.value.trim());
    inp.value = '';
  }, 300);
});

document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    clearTimeout(sendTimer);
    sendChat(e.target.value.trim());
    e.target.value = '';
  }
});

document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => sendChat(btn.dataset.q));
});

// Load chat history on page load
async function loadHistory() {
  try {
    const res = await fetch('/api/history');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      data.slice(-5).forEach(entry => {
        if (entry.userMessage) appendMessage('user', entry.userMessage);
        if (entry.botReply)    appendMessage('bot',  entry.botReply);
      });
    }
  } catch { /* graceful degradation */ }
}
loadHistory();

// ---- QUIZ ----
let quizQuestions = [];
let quizCurrent = 0;
let quizScore = 0;

document.getElementById('quiz-begin-btn').addEventListener('click', startQuiz);
document.getElementById('quiz-retry-btn').addEventListener('click', startQuiz);

async function startQuiz() {
  document.getElementById('quiz-start').hidden = true;
  document.getElementById('quiz-result').hidden = true;
  document.getElementById('quiz-questions').hidden = false;
  document.getElementById('quiz-question-wrap').innerHTML = `
    <div class="skeleton" style="height:24px;margin-bottom:16px"></div>
    <div class="skeleton" style="height:44px;margin-bottom:8px"></div>
    <div class="skeleton" style="height:44px;margin-bottom:8px"></div>
    <div class="skeleton" style="height:44px;margin-bottom:8px"></div>
    <div class="skeleton" style="height:44px"></div>
  `;

  try {
    const res = await fetch('/api/quiz', { method: 'POST' });
    const data = await res.json();
    quizQuestions = data.questions || [];
    quizCurrent = 0;
    quizScore = 0;
    renderQuizQuestion();
  } catch {
    document.getElementById('quiz-question-wrap').innerHTML = '<p style="color:var(--text-muted)">Failed to load questions. Please try again.</p>';
  }
}

function renderQuizQuestion() {
  const q = quizQuestions[quizCurrent];
  if (!q) return;

  const progress = ((quizCurrent + 1) / quizQuestions.length) * 100;
  document.getElementById('quiz-progress-text').textContent = `Question ${quizCurrent + 1} of ${quizQuestions.length}`;
  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
  const bar = document.querySelector('.quiz-progress-bar');
  bar.setAttribute('aria-valuenow', quizCurrent + 1);

  document.getElementById('quiz-question-wrap').innerHTML = `
    <div class="quiz-question" role="group" aria-labelledby="quiz-q">
      <p class="quiz-q-text" id="quiz-q">${q.question}</p>
      <div class="quiz-options" role="radiogroup" aria-label="Answer options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" aria-label="Option ${i+1}: ${opt}" onclick="answerQuiz(${i})">
            <strong>${String.fromCharCode(65 + i)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function answerQuiz(selected) {
  const q = quizQuestions[quizCurrent];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(btn => btn.disabled = true);

  const correctIndex = q.options.findIndex(o =>
    o.toLowerCase().includes(q.correct.toLowerCase()) || q.correct.toLowerCase().includes(o.toLowerCase())
  );
  const isCorrect = selected === correctIndex || q.options[selected] === q.correct;

  buttons[selected].classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect && correctIndex >= 0) buttons[correctIndex].classList.add('correct');
  if (isCorrect) quizScore++;

  const wrap = document.getElementById('quiz-question-wrap');
  const explanation = document.createElement('div');
  explanation.className = 'quiz-explanation';
  explanation.setAttribute('role', 'status');
  explanation.setAttribute('aria-live', 'polite');
  explanation.textContent = `${isCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${q.explanation || ''}`;
  wrap.appendChild(explanation);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'quiz-next-btn';
  nextBtn.textContent = quizCurrent + 1 < quizQuestions.length ? 'Next Question →' : 'See Results';
  nextBtn.setAttribute('aria-label', quizCurrent + 1 < quizQuestions.length ? 'Go to next question' : 'View your results');
  nextBtn.addEventListener('click', () => {
    quizCurrent++;
    if (quizCurrent < quizQuestions.length) {
      renderQuizQuestion();
    } else {
      showQuizResult();
    }
  });
  wrap.appendChild(nextBtn);
}

async function showQuizResult() {
  document.getElementById('quiz-questions').hidden = true;
  document.getElementById('quiz-result').hidden = false;

  const total = quizQuestions.length;
  const pct = Math.round((quizScore / total) * 100);
  const icon = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
  const msg = pct >= 80 ? "Excellent! You're a civic champion!" : pct >= 60 ? "Good effort! Keep learning about democracy." : "Keep exploring ElectIQ to build your knowledge!";

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-score').textContent = `${quizScore} / ${total} (${pct}%)`;
  document.getElementById('result-msg').textContent = msg;

  // Save score to Firebase via backend
  try {
    await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: quizScore, total, percentage: pct })
    });
  } catch { /* graceful degradation */ }
}

// ---- GOOGLE MAPS ----
window.initMap = function () {
  const mapEl = document.getElementById('google-map');
  document.getElementById('map-fallback').style.display = 'none';

  const map = new google.maps.Map(mapEl, {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5,
    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
  });

  // Mock polling stations
  const stations = [
    { name: 'Polling Station 1 — Delhi Central', lat: 28.6139, lng: 77.2090, address: 'Town Hall, Chandni Chowk, Delhi', hours: '7am – 6pm' },
    { name: 'Polling Station 2 — Mumbai South', lat: 18.9388, lng: 72.8354, address: 'Municipal School, Colaba, Mumbai', hours: '7am – 6pm' },
    { name: 'Polling Station 3 — Bangalore', lat: 12.9716, lng: 77.5946, address: 'Community Centre, Indiranagar, Bangalore', hours: '7am – 6pm' },
    { name: 'Polling Station 4 — Chennai', lat: 13.0827, lng: 80.2707, address: 'Government School, Anna Nagar, Chennai', hours: '7am – 6pm' },
    { name: 'Polling Station 5 — Kolkata', lat: 22.5726, lng: 88.3639, address: 'Panchayat Office, Salt Lake, Kolkata', hours: '7am – 6pm' },
  ];

  stations.forEach(station => {
    const marker = new google.maps.Marker({
      position: { lat: station.lat, lng: station.lng },
      map,
      title: station.name,
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#1A237E', fillOpacity: 1, strokeColor: '#FFC107', strokeWeight: 2 }
    });
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family:DM Sans,sans-serif;padding:4px">
        <strong style="color:#1A237E">${station.name}</strong><br/>
        <span style="font-size:13px;color:#555">${station.address}</span><br/>
        <span style="font-size:12px;color:#888">🕐 ${station.hours}</span>
      </div>`
    });
    marker.addListener('click', () => infoWindow.open(map, marker));
  });

  // Map search
  document.getElementById('map-search-btn').addEventListener('click', () => {
    const query = document.getElementById('map-search').value.trim();
    if (!query) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: query + ', India' }, (results, status) => {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(12);
      }
    });
  });

  document.getElementById('map-search').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('map-search-btn').click();
  });
};
