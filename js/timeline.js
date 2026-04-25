import { TIMELINE_DATA } from './data.js';

export let activeCountry = 'india';
let activeStep = null;

// ---- TIMELINE ----

function renderTimeline(country) {
  const steps = TIMELINE_DATA[country];
  const container = document.getElementById('timeline-steps');
  container.innerHTML = steps
    .map(
      (step, i) => `
    <div class="timeline-step${activeStep === i ? ' active' : ''}"
      role="button"
      tabindex="0"
      aria-label="${step.name} — ${step.duration}"
      data-index="${i}">
      <div class="step-num" aria-hidden="true">${i + 1}</div>
      <div class="step-icon" aria-hidden="true">${step.icon}</div>
      <div class="step-name">${step.name}</div>
      <div class="step-duration">${step.duration}</div>
    </div>
  `,
    )
    .join('');

  // Attach event listeners to timeline steps
  container.querySelectorAll('.timeline-step').forEach((el) => {
    el.addEventListener('click', () => selectStep(parseInt(el.dataset.index)));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectStep(parseInt(el.dataset.index));
      }
    });
  });
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

document.querySelectorAll('.etab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.etab').forEach((b) => {
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

export { renderTimeline };
