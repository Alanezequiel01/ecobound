const MIN_SCORE_TO_WIN = 40;

const SCREENS = {
  menu: document.getElementById('screenMenu'),
  intro: document.getElementById('screenIntro'),
  question: document.getElementById('screenQuestion'),
  ending: document.getElementById('screenEnding'),
};

const els = {
  bgCurrent: document.getElementById('bgCurrent'),
  bgNext: document.getElementById('bgNext'),
  settingsPanel: document.getElementById('settingsPanel'),
  zoneLabel: document.getElementById('zoneLabel'),
  nodeType: document.getElementById('nodeType'),
  title: document.getElementById('questionTitle'),
  situation: document.getElementById('questionSituation'),
  text: document.getElementById('questionText'),
  answers: document.getElementById('answers'),
  score: document.getElementById('score'),
  delta: document.getElementById('scoreDelta'),
  music: document.getElementById('bgMusic'),
  soundIcon: document.getElementById('soundIcon'),
  muteText: document.getElementById('muteText'),
  endingKicker: document.getElementById('endingKicker'),
  endingTitle: document.getElementById('endingTitle'),
  endingText: document.getElementById('endingText'),
  endingCard: document.querySelector('.ending-card'),
};

const imageFor = name => `assets/images/${name}`;

const nodes = {
  q1: {
    kind: 'Pregunta principal', zone: 'Inicio - El Transporte', image: 'question-transport.jpg',
    title: 'El Transporte',
    situation: 'Tenes que ir a la escuela, que esta a 3 km de tu casa. Podes ir en auto familiar o usar bus publico/bicicleta.',
    question: 'Decidis usar el auto para mayor comodidad',
    answers: [
      { label: 'Si', detail: 'Camino rapido, impacto alto.', points: -1, next: 'recoveryConsumption' },
      { label: 'No', detail: 'Elegis transporte publico o bicicleta.', points: 5, next: 'q2', correct: true },
    ],
  },
  q2: {
    kind: 'Pregunta principal', zone: 'Puerta de los Residuos', image: 'question-waste.jpg',
    title: 'Puerta de los Residuos',
    situation: 'Despues de compras tenes plastico, carton y restos de comida. En tu zona hay contenedores de reciclaje.',
    question: 'Decidis tirar toda la basura junta en un mismo recipiente',
    answers: [
      { label: 'Si', detail: 'Ignoras la separacion de residuos.', points: -5, next: 'recoveryConsumption' },
      { label: 'No', detail: 'Separas los residuos y reduces el dano ambiental.', points: 5, next: 'q3', correct: true },
    ],
  },
  recoveryConsumption: {
    kind: 'Zona de recuperacion', zone: 'Zona del Consumo Responsable', image: 'recovery-consumption.jpg',
    title: 'Consumo Responsable',
    situation: 'Se presenta la oportunidad de comprar un producto: uno de moda rapida y desechable, u otro duradero, etico y con minimo embalaje.',
    question: 'Que tipo de producto se prioriza para la compra',
    answers: [
      { label: 'Moda rapida', detail: 'Barato ahora, costoso para el planeta.', points: -5, next: 'recoveryIndustry' },
      { label: 'Producto duradero/etico', detail: 'Compra con menor impacto y mas vida util.', points: 5, next: 'q3', correct: true },
    ],
  },
  q3: {
    kind: 'Pregunta principal', zone: 'Puerta de la Energia Renovable', image: 'question-energy.jpg',
    title: 'Energia Renovable',
    situation: 'Tu pais decide entre una central de carbon contaminante o un parque eolico/solar renovable.',
    question: 'Tu voto apoya la energia renovable para la nueva infraestructura',
    answers: [
      { label: 'Si', detail: 'Priorizas el impacto a largo plazo.', points: 10, next: 'q4', correct: true },
      { label: 'No', detail: 'Eliges energia contaminante.', points: -3, next: 'recoveryIndustry' },
    ],
  },
  recoveryIndustry: {
    kind: 'Zona de recuperacion', zone: 'Industria y Energia', image: 'recovery-industry.jpg',
    title: 'Industria y Energia',
    situation: 'Una ciudad debe aprobar una fabrica: una obsoleta que contamina o una moderna que recicla sus desechos y usa energia solar.',
    question: 'Que tipo de fabrica se aprueba',
    answers: [
      { label: 'Fabrica contaminante', detail: 'Produce rapido, deteriora el aire.', points: -12, next: 'recoveryAgriculture' },
      { label: 'Fabrica moderna', detail: 'Invierte en tecnologia limpia.', points: 5, next: 'q4', correct: true },
    ],
  },
  recoveryAgriculture: {
    kind: 'Zona de recuperacion', zone: 'Agricultura y Alimentacion', image: 'recovery-agriculture.jpg',
    title: 'Agricultura y Alimentacion',
    situation: 'Se debe cultivar para una poblacion creciente: agricultura intensiva con pesticidas o agricultura organica y diversificada.',
    question: 'Que modelo agricola se elige',
    answers: [
      { label: 'Agricultura intensiva', detail: 'Agota suelo y contamina agua.', points: -20, next: 'q4' },
      { label: 'Agricultura organica', detail: 'Protege suelo, agua y biodiversidad.', points: 15, next: 'q4', correct: true },
    ],
  },
  q4: {
    kind: 'Pregunta principal', zone: 'Puerta del Consumo de Agua', image: 'question-water.jpg',
    title: 'Consumo de Agua',
    situation: 'En tu region hay escasez de agua. Al cepillarte los dientes, el grifo queda abierto.',
    question: 'Decides cerrar el grifo mientras te cepillas los dientes',
    answers: [
      { label: 'Si', detail: 'Ahorras un recurso vital.', points: 10, next: 'q5', correct: true },
      { label: 'No', detail: 'Desperdicias agua en una zona vulnerable.', points: -3, next: 'recoveryBiodiversity' },
    ],
  },
  q5: {
    kind: 'Pregunta principal', zone: 'Oceanos y Biodiversidad', image: 'question-ocean.jpg',
    title: 'Oceanos y Biodiversidad',
    situation: 'Estas en la costa y ves mucha basura plastica. Hay una campana de limpieza activa.',
    question: 'Te unes a la campana de limpieza de playas',
    answers: [
      { label: 'Si', detail: 'Ayudas a reducir la contaminacion oceanica.', points: 10, next: 'q6Hope', correct: true },
      { label: 'No', detail: 'Dejas que el plastico llegue al mar.', points: -6, next: 'recoveryBiodiversity' },
    ],
  },
  recoveryBiodiversity: {
    kind: 'Zona de recuperacion', zone: 'Biodiversidad y Ecosistemas', image: 'recovery-biodiversity.jpg',
    title: 'Biodiversidad y Ecosistemas',
    situation: 'Un bosque nativo podria talarse para construir un nuevo complejo urbanistico.',
    question: 'Se prioriza la conservacion de la biodiversidad o el desarrollo urbano',
    answers: [
      { label: 'Talar el bosque', detail: 'La ciudad crece, el ecosistema desaparece.', points: -15, next: 'q6Hope' },
      { label: 'Proteger el bosque', detail: 'Se crea un parque ecologico.', points: 15, next: 'q6Hope', correct: true },
    ],
  },
  q6Hope: {
    kind: 'Pregunta principal', zone: 'Pasillo de la Esperanza', image: 'question-hope.jpg',
    title: 'Pasillo de la Esperanza',
    situation: 'El aire se vuelve ligero y el silencio canta antiguas promesas. El camino se abre solo ante quienes creen en reconstruir.',
    question: 'Una comunidad recibe fondos limitados. Que decision abre un futuro sostenible',
    answers: [
      { label: 'Restaurar espacios verdes', detail: 'Reforestar, educar y cuidar recursos compartidos.', points: 10, next: 'q7Abyss', correct: true },
      { label: 'Ignorar el plan ambiental', detail: 'Gastar sin reparar el dano acumulado.', points: -8, next: 'lastAgriculture' },
    ],
  },
  q7Abyss: {
    kind: 'Pregunta principal', zone: 'Pasillo del Abismo', image: 'question-abyss.jpg',
    title: 'Pasillo del Abismo',
    situation: 'Las sombras muestran el costo del olvido: recursos desperdiciados, aire pesado y decisiones postergadas.',
    question: 'Para salir, que verdad deben aceptar los jugadores',
    answers: [
      { label: 'Cada accion cuenta', detail: 'Cambiar habitos pequenos tambien transforma sistemas.', points: 10, next: 'finalCheck', correct: true },
      { label: 'Ya es demasiado tarde', detail: 'La inercia decide por ustedes.', points: -10, next: 'lastAgriculture' },
    ],
  },
  lastAgriculture: {
    kind: 'Ultima recuperacion', zone: 'Agricultura y Alimentacion', image: 'last-agriculture.jpg',
    title: 'Ultima Oportunidad',
    situation: 'La ciudad crece rapidamente y necesita producir mas alimentos sin destruir la salud del planeta.',
    question: 'Que modelo agricola garantiza alimento y salud ambiental a largo plazo',
    answers: [
      { label: 'Agricultura intensiva', detail: 'Mas quimicos, monocultivo y suelo agotado.', points: -30, next: 'finalCheck' },
      { label: 'Organica y diversificada', detail: 'Abonos naturales, rotacion y biodiversidad.', points: 30, next: 'finalCheck', correct: true },
    ],
  },
};

let score = 0;
let currentImage = imageFor('menu.jpg');
let muted = false;
let transitionTimer = null;
let audioContext = null;


function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function playToneSequence(sequence, volume = 0.18) {
  const context = getAudioContext();
  if (!context) return;

  const master = context.createGain();
  master.gain.setValueAtTime(volume, context.currentTime);
  master.connect(context.destination);

  sequence.forEach((tone, index) => {
    const start = context.currentTime + tone.delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = tone.type || 'sine';
    oscillator.frequency.setValueAtTime(tone.from, start);
    oscillator.frequency.exponentialRampToValueAtTime(tone.to, start + tone.duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain || 0.65, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + tone.duration + 0.02);
  });
}

function playUiSound(type = 'general') {
  const sounds = {
    general: [
      { from: 520, to: 860, duration: 0.07, delay: 0, type: 'triangle', gain: 0.50 },
      { from: 1040, to: 1320, duration: 0.06, delay: 0.055, type: 'sine', gain: 0.28 },
    ],
    correct: [
      { from: 620, to: 940, duration: 0.08, delay: 0, type: 'triangle', gain: 0.48 },
      { from: 940, to: 1480, duration: 0.12, delay: 0.075, type: 'sine', gain: 0.38 },
      { from: 1480, to: 1760, duration: 0.10, delay: 0.18, type: 'sine', gain: 0.22 },
    ],
    wrong: [
      { from: 420, to: 260, duration: 0.13, delay: 0, type: 'sawtooth', gain: 0.34 },
      { from: 260, to: 170, duration: 0.16, delay: 0.12, type: 'triangle', gain: 0.26 },
    ],
  };
  playToneSequence(sounds[type] || sounds.general, type === 'wrong' ? 0.11 : 0.15);
}

function showScreen(name) {
  Object.values(SCREENS).forEach(screen => screen.classList.remove('active'));
  SCREENS[name].classList.add('active');
}

function setBackground(fileName) {
  const nextUrl = imageFor(fileName);
  if (nextUrl === currentImage) return;

  clearTimeout(transitionTimer);
  els.bgNext.style.backgroundImage = `url("${nextUrl}")`;
  els.bgNext.classList.add('visible');

  transitionTimer = setTimeout(() => {
    els.bgCurrent.style.backgroundImage = `url("${nextUrl}")`;
    els.bgNext.classList.remove('visible');
    currentImage = nextUrl;
  }, 1120);
}

function tryStartMusic() {
  els.music.volume = Number(document.getElementById('volumeRange').value);
  els.music.play().catch(() => {
    const resume = () => {
      els.music.play().catch(() => {});
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  });
}

function toggleSettings() {
  playUiSound('general');
  els.settingsPanel.classList.toggle('open');
}

function closeSettings() {
  els.settingsPanel.classList.remove('open');
}

function updateMuteUi() {
  els.soundIcon.innerHTML = muted ? '&#215;' : '&#9834;';
  els.muteText.textContent = muted ? 'Activar musica' : 'Mutear musica';
}

function renderNode(id) {
  const node = nodes[id];
  setBackground(node.image);
  showScreen('question');
  els.zoneLabel.textContent = node.zone;
  els.nodeType.textContent = node.kind;
  els.title.textContent = node.title;
  els.situation.textContent = node.situation;
  els.text.textContent = node.question;
  els.answers.innerHTML = '';

  node.answers.forEach(answer => {
    const button = document.createElement('button');
    button.className = 'answer-button';
    button.innerHTML = `<strong>${answer.label}</strong><span>${answer.detail}</span>`;
    button.addEventListener('click', () => chooseAnswer(button, answer));
    els.answers.appendChild(button);
  });
}

function chooseAnswer(button, answer) {
  playUiSound(answer.correct ? 'correct' : 'wrong');
  closeSettings();
  [...els.answers.children].forEach(child => { child.disabled = true; });
  button.classList.add(answer.correct ? 'correct-pulse' : 'wrong-pulse');
  score += answer.points;
  els.score.textContent = score;
  els.delta.textContent = `${answer.points > 0 ? '+' : ''}${answer.points}`;
  els.delta.className = answer.points >= 0 ? 'positive' : 'negative';

  setTimeout(() => {
    els.delta.textContent = '';
    if (answer.next === 'finalCheck') finishGame();
    else renderNode(answer.next);
  }, 760);
}

function finishGame() {
  const won = score >= MIN_SCORE_TO_WIN;
  setBackground(won ? 'ending-oasis.jpg' : 'ending-valley.jpg');
  showScreen('ending');
  els.endingCard.classList.toggle('win', won);
  els.endingCard.classList.toggle('lose', !won);
  els.endingKicker.textContent = won ? 'Oasis Verde' : 'Valle de los Huesos';
  els.endingTitle.textContent = won ? 'Escapaste del laberinto' : 'El laberinto te reclama';
  els.endingText.textContent = won
    ? `Lograste ${score} puntos. Tus decisiones reconstruyeron un futuro limpio, verde y sostenible.`
    : `Terminaste con ${score} puntos. No alcanzaste los ${MIN_SCORE_TO_WIN} necesarios y el camino se cerro entre ruinas.`;
}

function resetGame() {
  score = 0;
  els.score.textContent = '0';
  els.delta.textContent = '';
  renderNode('q1');
}

function init() {
  els.bgCurrent.style.backgroundImage = `url("${currentImage}")`;
  tryStartMusic();

  document.getElementById('btnPlay').addEventListener('click', () => {
    playUiSound('general');
    closeSettings();
    setBackground('intro.jpg');
    showScreen('intro');
    tryStartMusic();
  });
  document.getElementById('btnSettingsMenu').addEventListener('click', toggleSettings);
  document.getElementById('btnSettingsToggle').addEventListener('click', toggleSettings);
  document.getElementById('btnStartRun').addEventListener('click', () => {
    playUiSound('general');
    closeSettings();
    resetGame();
  });
  document.getElementById('btnBackToMenuFromIntro').addEventListener('click', () => {
    playUiSound('general');
    closeSettings();
    setBackground('menu.jpg');
    showScreen('menu');
  });
  document.getElementById('btnMainMenuFromSettings').addEventListener('click', () => {
    playUiSound('general');
    closeSettings();
    setBackground('menu.jpg');
    showScreen('menu');
  });
  document.getElementById('btnRestart').addEventListener('click', () => {
    playUiSound('general');
    closeSettings();
    setBackground('menu.jpg');
    showScreen('menu');
  });
  document.getElementById('volumeRange').addEventListener('input', event => {
    els.music.volume = Number(event.target.value);
  });
  document.getElementById('volumeRange').addEventListener('pointerdown', () => playUiSound('general'));
  document.getElementById('btnMute').addEventListener('click', () => {
    playUiSound('general');
    muted = !muted;
    els.music.muted = muted;
    if (!muted) tryStartMusic();
    updateMuteUi();
  });

  document.addEventListener('pointerdown', event => {
    const clickedSettings = els.settingsPanel.contains(event.target);
    const clickedToggle = document.getElementById('btnSettingsToggle').contains(event.target);
    const clickedMenuSettings = document.getElementById('btnSettingsMenu').contains(event.target);
    if (!clickedSettings && !clickedToggle && !clickedMenuSettings) closeSettings();
  });

  document.querySelectorAll('.panel-button').forEach(button => {
    if (!button.closest('#answers')) {
      button.addEventListener('pointerdown', () => getAudioContext(), { passive: true });
    }
  });

  updateMuteUi();
}

init();
