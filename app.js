/* ------------------------------------------------------------------ *
 * CONFIG — everything you may want to change lives here.
 * ------------------------------------------------------------------ */
const CONFIG = {
  /** Ceremony start, ISO 8601 with offset. +01:00 is Spanish winter time. */
  weddingDate: '2026-11-14T13:00:00+01:00',

  /** House-fund progress: 'cimientos' | 'paredes' | 'tejado' | 'terraza'. */
  houseStage: 'paredes',

  /** Set to false to hide the bank-transfer block entirely. */
  showIban: true,

  /** TODO: replace with the real account number before sharing the site. */
  iban: 'ES12 3456 7890 1234 5678 9012',
};
/* ------------------------------------------------------------------ */

const HOUSE_STAGES = ['cimientos', 'paredes', 'tejado', 'terraza'];

const HOUSE_STAGE_CAPTIONS = [
  'Vamos por los cimientos. Todo lo demás depende de vosotros.',
  'Vamos por las paredes. La terraza depende de vosotros.',
  'Ya casi hay tejado. La terraza depende de vosotros.',
  'Terraza incluida: quedáis invitados a la inauguración.',
];

/** Parts of the house drawing, in build order. */
const HOUSE_PARTS = ['cim', 'par', 'tej', 'ter'];

const PART_BUILT = { fill: '#e9e0cb', stroke: '#cdbfa2', dash: '0' };
const PART_PENDING = { fill: 'transparent', stroke: '#dfe5cc', dash: '5 4' };

const pad = (n) => String(n).padStart(2, '0');

/* ---------------------------- Countdown --------------------------- */

function startCountdown() {
  const fields = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  };

  const target = new Date(CONFIG.weddingDate).getTime();
  if (Number.isNaN(target)) return;

  const tick = () => {
    const remaining = Math.max(0, target - Date.now());
    fields.d.textContent = pad(Math.floor(remaining / 864e5));
    fields.h.textContent = pad(Math.floor(remaining / 36e5) % 24);
    fields.m.textContent = pad(Math.floor(remaining / 6e4) % 60);
    fields.s.textContent = pad(Math.floor(remaining / 1e3) % 60);
  };

  tick();
  setInterval(tick, 1000);
}

/* ------------------------------ Cover ----------------------------- */

function setUpCover() {
  const cover = document.getElementById('cover');
  const card = document.getElementById('cover-card');
  const hint = document.getElementById('cover-hint');
  const doorLeft = document.getElementById('door-left');
  const doorRight = document.getElementById('door-right');
  const bands = document.querySelectorAll('.js-band');

  let isOpen = false;

  const render = () => {
    doorLeft.style.transform = isOpen ? 'rotateY(-168deg)' : 'rotateY(0deg)';
    doorRight.style.transform = isOpen ? 'rotateY(168deg)' : 'rotateY(0deg)';
    card.style.transform = isOpen ? 'scale(1)' : 'scale(.94)';
    hint.style.opacity = isOpen ? '0' : '1';

    bands.forEach((band) => {
      band.style.transform = isOpen ? 'translateY(190px)' : 'translateY(0)';
      band.style.opacity = isOpen ? '0' : '1';
    });
  };

  const toggle = () => {
    isOpen = !isOpen;
    cover.setAttribute('aria-expanded', String(isOpen));
    render();
  };

  cover.setAttribute('aria-expanded', 'false');
  cover.addEventListener('click', toggle);
  cover.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggle();
  });
}

/* --------------------------- House fund --------------------------- */

function renderHouse() {
  const stageIndex = Math.max(0, HOUSE_STAGES.indexOf(CONFIG.houseStage));

  HOUSE_PARTS.forEach((part, index) => {
    const style = index <= stageIndex ? PART_BUILT : PART_PENDING;

    document.querySelectorAll(`[data-part="${part}"]`).forEach((node) => {
      const paints = node.dataset.paint.split(' ');
      if (paints.includes('fill')) node.setAttribute('fill', style.fill);
      node.setAttribute('stroke', style.stroke);
      node.setAttribute('stroke-dasharray', style.dash);
    });

    const swatch = document.querySelector(`[data-swatch="${part}"]`);
    if (swatch) {
      swatch.style.background = style.fill;
      swatch.style.borderColor = style.stroke;
    }
  });

  document.getElementById('casa-txt').textContent = HOUSE_STAGE_CAPTIONS[stageIndex];
}

/* ------------------------------- IBAN ----------------------------- */

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Safari on http:// and older browsers have no async clipboard.
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }

    document.body.removeChild(field);
    return copied;
  }
}

function setUpIban() {
  const box = document.getElementById('iban-box');
  if (!CONFIG.showIban) return;

  const button = document.getElementById('iban-copy');
  document.getElementById('iban-value').textContent = CONFIG.iban;
  box.hidden = false;

  let resetTimer;

  button.addEventListener('click', async () => {
    const copied = await copyToClipboard(CONFIG.iban);
    button.textContent = copied ? 'Copiado' : 'Copia el número a mano';

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.textContent = 'Copiar IBAN';
    }, 1800);
  });
}

/* ----------------------------- Photos ----------------------------- */

/** A missing photo should look like a soft placeholder, not a broken icon. */
function setUpPhotoFallback() {
  const markMissing = (photo) => {
    photo.classList.add('is-missing');
    photo.removeAttribute('src');
  };

  document.querySelectorAll('.story-photo').forEach((photo) => {
    photo.addEventListener('error', () => markMissing(photo));

    // The image may have failed before this script ran.
    if (photo.complete && photo.naturalWidth === 0) markMissing(photo);
  });
}

/* ------------------------------- Map ------------------------------ */

function setUpMapShield() {
  const shield = document.getElementById('map-shield');
  const activate = () => shield.classList.add('is-off');

  shield.addEventListener('click', activate);
  shield.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate();
  });
}

/* ------------------------------ Boot ------------------------------ */

setUpPhotoFallback();
setUpCover();
setUpMapShield();
startCountdown();
renderHouse();
setUpIban();
