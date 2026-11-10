// Certificados: cada card é um link para o PDF (funciona sem JavaScript).
// Com JavaScript, o card abre um diálogo; com movimento ligado, o documento
// sai do card até o centro, recebe um brilho e um selo, e inclina com o ponteiro.
// Com movimento pausado ou reduzido, abre direto, sem efeitos.

const BASE = 'certificados/';
export const certificates = {
  'mba-ia': {
    title: 'MBA em Inteligência Artificial', issuer: 'Universidade Estácio de Sá', size: [1132, 1600],
    note: 'Declaração de conclusão de pós-graduação lato sensu, 360 h. CPF, matrícula e data de nascimento foram cobertos antes da publicação.'
  },
  'gestao-ti': {
    title: 'Tecnólogo em Gestão da Tecnologia da Informação', issuer: 'Centro Universitário Estácio de Santa Catarina', size: [1600, 1076], back: true,
    note: 'Diploma digital de graduação tecnológica: conclusão em dezembro de 2024 e colação de grau em setembro de 2025. Data de nascimento e RG foram cobertos antes da publicação. O verso traz o registro do diploma.'
  },
  'governanca-ti': {
    title: 'Implantação de Governança de T.I.', issuer: 'Centro Universitário Estácio de Santa Catarina', size: [1600, 1132], back: true,
    note: 'Certificação intermediária da graduação em Gestão da TI, 240 h. O verso lista as disciplinas e o código de verificação.'
  },
  'melhoria-continua': {
    title: 'Aplicação da Melhoria Contínua', issuer: 'Centro Universitário Estácio de Santa Catarina', size: [1600, 1132], back: true,
    note: 'Certificação intermediária da graduação em Gestão da TI, 240 h. O verso lista as disciplinas e o código de verificação.'
  },
  'gestao-projetos': {
    title: 'Gestão de Projetos e de Informação', issuer: 'Centro Universitário Estácio de Santa Catarina', size: [1600, 1132], back: true,
    note: 'Certificação intermediária da graduação em Gestão da TI, 240 h. O verso lista as disciplinas e o código de verificação.'
  },
  'programacao-internet': {
    title: 'Programação para Internet', issuer: 'Centro Universitário Estácio de Santa Catarina', size: [1600, 1132], back: true,
    note: 'Certificação intermediária da graduação em Gestão da TI, 240 h. O verso lista as disciplinas e o código de verificação.'
  },
  'python-udemy': {
    title: 'Programação Python do Zero ao Avançado', issuer: 'Udemy', size: [1600, 1131],
    note: 'Curso livre de 15,5 h, com mais dois cursos incluídos.',
    verify: ['Verificar na Udemy', 'https://ude.my/UC-5867c04c-498f-4fa6-a1c0-262ef98b24e6']
  }
};

const dialog = document.querySelector('#cert-dialog');
const stage = dialog.querySelector('.cert-stage');
const tilt = dialog.querySelector('.cert-tilt');
const flipper = dialog.querySelector('.cert-flipper');
const gloss = dialog.querySelector('.cert-gloss');
const seal = dialog.querySelector('.cert-seal');
const flipButton = dialog.querySelector('#cert-flip');
const links = dialog.querySelector('#cert-links');
let trigger = null;
let flying = false;

const motionOn = () => document.documentElement.dataset.motion === 'on';

function face(src, alt, [width, height], className) {
  const img = document.createElement('img');
  Object.assign(img, { src, alt, width, height, className: 'cert-face ' + className, decoding: 'async' });
  return img;
}

function setFlipped(flipped) {
  flipper.classList.toggle('flipped', flipped);
  flipButton.setAttribute('aria-pressed', String(flipped));
  flipButton.textContent = flipped ? 'Ver frente ↻' : 'Ver verso ↻';
  const [front, back] = flipper.children;
  front?.setAttribute('aria-hidden', String(flipped));
  back?.setAttribute('aria-hidden', String(!flipped));
}

function sparks() {
  const box = seal.getBoundingClientRect(); const host = tilt.getBoundingClientRect();
  const cx = box.left + box.width / 2 - host.left; const cy = box.top + box.height / 2 - host.top;
  for (let i = 0; i < 14; i++) {
    const spark = document.createElement('span'); spark.className = 'cert-spark';
    spark.style.left = cx + 'px'; spark.style.top = cy + 'px'; tilt.append(spark);
    const angle = (Math.PI * 2 * i) / 14 + Math.random() * .3; const distance = 46 + Math.random() * 40;
    spark.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(.2)`, opacity: 0 }
    ], { duration: 700 + Math.random() * 300, delay: 1150, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' })
      .finished.catch(() => {}).finally(() => spark.remove());
  }
}

async function open(id, card) {
  const cert = certificates[id]; if (!cert) return false;
  trigger = card;
  dialog.querySelector('#cert-title').textContent = cert.title;
  dialog.querySelector('#cert-issuer').textContent = cert.issuer;
  dialog.querySelector('#cert-note').textContent = cert.note;
  const front = face(`${BASE}${id}.jpg`, `Certificado ${cert.title}, frente`, cert.size, 'cert-front');
  const faces = [front];
  if (cert.back) faces.push(face(`${BASE}${id}-verso.jpg`, `Certificado ${cert.title}, verso`, cert.size, 'cert-back'));
  flipper.replaceChildren(...faces);
  flipButton.hidden = !cert.back; setFlipped(false);
  tilt.classList.toggle('portrait', cert.size[1] > cert.size[0]);

  links.replaceChildren();
  const add = (label, href) => { const a = document.createElement('a'); a.textContent = label + ' ↗'; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a); };
  add('Abrir PDF', `${BASE}${id}.pdf`);
  if (cert.verify) add(...cert.verify);

  gloss.classList.remove('shine'); seal.classList.remove('stamp'); tilt.style.transform = '';
  document.body.style.overflow = 'hidden';
  dialog.showModal(); dialog.querySelector('#close-cert').focus();

  if (!motionOn()) return true;
  try { await front.decode(); } catch { /* imagem segue carregando; anima mesmo assim */ }
  if (!dialog.open) return true;
  const from = (card.querySelector('.cert-thumb') || card).getBoundingClientRect(); const to = tilt.getBoundingClientRect();
  const dx = from ? from.left + from.width / 2 - (to.left + to.width / 2) : 0;
  const dy = from ? from.top + from.height / 2 - (to.top + to.height / 2) : 120;
  const scale = from ? Math.max(.15, from.width / to.width) : .6;
  flying = true; dialog.classList.add('flying');
  void gloss.offsetWidth; gloss.classList.add('shine'); seal.classList.add('stamp');
  const flight = tilt.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotateX(22deg) rotateY(-28deg)`, opacity: .4 },
    { offset: .72, transform: 'translate(0, 0) scale(1.03) rotateX(-4deg) rotateY(5deg)', opacity: 1 },
    { transform: 'none', opacity: 1 }
  ], { duration: 950, easing: 'cubic-bezier(.2,.8,.2,1)' });
  sparks();
  flight.finished.catch(() => {}).finally(() => { flying = false; dialog.classList.remove('flying'); });
  return true;
}

// Cards da seção e os de formação no "sobre": qualquer link com data-cert abre o diálogo.
document.querySelectorAll('a[data-cert]').forEach(card => card.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); open(card.dataset.cert, card);
}));

flipButton.addEventListener('click', () => setFlipped(!flipper.classList.contains('flipped')));
dialog.querySelector('#close-cert').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = ''; tilt.getAnimations().forEach(a => a.cancel());
  dialog.classList.remove('flying'); flying = false; tilt.style.transform = '';
  if (trigger) trigger.focus();
});

// Inclinação com o ponteiro, só com movimento ligado e depois da entrada.
stage.addEventListener('pointermove', event => {
  if (!motionOn()) { tilt.style.transform = ''; tilt.classList.remove('glaring'); return; }
  if (flying || event.pointerType === 'touch') return;
  const r = tilt.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (event.clientX - r.left) / r.width));
  const y = Math.min(1, Math.max(0, (event.clientY - r.top) / r.height));
  tilt.style.transform = `rotateX(${(.5 - y) * 8}deg) rotateY(${(x - .5) * 10}deg)`;
  tilt.style.setProperty('--gx', `${x * 100}%`); tilt.style.setProperty('--gy', `${y * 100}%`);
  tilt.classList.add('glaring');
});
stage.addEventListener('pointerleave', () => { tilt.style.transform = ''; tilt.classList.remove('glaring'); });
