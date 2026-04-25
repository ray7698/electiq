import { SESSION_ID, getCurrentLang } from './state.js';

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
    <div class="skeleton" style="height:24px;width:80%;margin-bottom:20px"></div>
    <div class="skeleton" style="height:50px;margin-bottom:12px"></div>
    <div class="skeleton" style="height:50px;margin-bottom:12px"></div>
    <div class="skeleton" style="height:50px;margin-bottom:12px"></div>
    <div class="skeleton" style="height:50px"></div>
  `;

  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': SESSION_ID,
      },
      body: JSON.stringify({ lang: getCurrentLang() }),
    });
    const data = await res.json();
    quizQuestions = data.questions || [];
    quizCurrent = 0;
    quizScore = 0;
    renderQuizQuestion();
  } catch {
    document.getElementById('quiz-question-wrap').innerHTML =
      '<p style="color:var(--text-muted)">Failed to load questions. Please try again.</p>';
  }
}

function renderQuizQuestion() {
  const q = quizQuestions[quizCurrent];
  if (!q) return;

  const progress = ((quizCurrent + 1) / quizQuestions.length) * 100;
  document.getElementById('quiz-progress-text').textContent =
    `Question ${quizCurrent + 1} of ${quizQuestions.length}`;
  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
  const bar = document.querySelector('.quiz-progress-bar');
  bar.setAttribute('aria-valuenow', quizCurrent + 1);

  const quizWrap = document.getElementById('quiz-question-wrap');
  quizWrap.innerHTML = `
    <div class="quiz-question" role="group" aria-labelledby="quiz-q">
      <p class="quiz-q-text" id="quiz-q">${q.question}</p>
      <div class="quiz-options" role="radiogroup" aria-label="Answer options">
        ${q.options
          .map(
            (opt, i) => `
          <button class="quiz-option" role="radio" aria-checked="false" data-index="${i}" aria-label="Option ${i + 1}: ${opt}">
            <strong>${String.fromCharCode(65 + i)}.</strong> ${opt}
          </button>
        `,
          )
          .join('')}
      </div>
    </div>
  `;

  // Attach listeners manually for reliability
  quizWrap.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      answerQuiz(parseInt(btn.dataset.index));
    });
  });
}

function answerQuiz(selected) {
  const q = quizQuestions[quizCurrent];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach((btn) => (btn.disabled = true));

  const correctIndex = q.options.indexOf(q.correct);
  const isCorrect = selected === correctIndex;

  buttons[selected].setAttribute('aria-checked', 'true');
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
  nextBtn.setAttribute(
    'aria-label',
    quizCurrent + 1 < quizQuestions.length ? 'Go to next question' : 'View your results',
  );
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
  const msg =
    pct >= 80
      ? "Excellent! You're a civic champion!"
      : pct >= 60
        ? 'Good effort! Keep learning about democracy.'
        : 'Keep exploring ElectIQ to build your knowledge!';

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-score').textContent = `${quizScore} / ${total} (${pct}%)`;
  document.getElementById('result-msg').textContent = msg;

  // Save score to Firebase via backend
  try {
    await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': SESSION_ID,
      },
      body: JSON.stringify({ score: quizScore, total, percentage: pct, lang: getCurrentLang() }),
    });
  } catch {
    /* graceful degradation */
  }
}
