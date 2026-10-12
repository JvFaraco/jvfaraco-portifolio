import { projects } from './projects.js';

const root = document.documentElement;
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* preferences remain session-local */ } }
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.querySelector('#theme-toggle');
const motionToggle = document.querySelector('#motion-toggle');
const savedTheme = storage.get('jvf-theme');
root.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
let motionPaused = storage.get('jvf-motion') === 'off';

function syncTheme() {
  themeToggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#17191b' : '#f7f5ef';
}
function syncMotion() {
  const off = motionPaused || reducedMotion.matches;
  root.dataset.motion = off ? 'off' : 'on';
  motionToggle.textContent = off ? 'Animações pausadas' : 'Pausar animações';
  motionToggle.setAttribute('aria-pressed', String(off));
  motionToggle.disabled = reducedMotion.matches;
  motionToggle.title = reducedMotion.matches ? 'Movimento reduzido conforme a preferência do sistema' : 'Alternar animações';
}
syncTheme(); syncMotion();
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  storage.set('jvf-theme', root.dataset.theme); syncTheme();
});
motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; storage.set('jvf-motion', motionPaused ? 'off' : 'on'); syncMotion(); });
reducedMotion.addEventListener('change', syncMotion);

const navigation = document.querySelector('#navigation');
const menuToggle = document.querySelector('#menu-toggle');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir navegação');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open); menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const cards = [...document.querySelectorAll('.project-card')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(filter => {
    const active = filter === button; filter.classList.toggle('active', active); filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) { count++; card.classList.add('visible'); }
  });
  document.querySelector('#filter-count').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
}));

const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
function addSection(container, title, content) {
  const section = document.createElement('section'); section.className = 'dialog-section';
  const heading = document.createElement('h3'); heading.textContent = title; section.append(heading);
  if (Array.isArray(content)) {
    const list = document.createElement('ul');
    content.forEach(value => { const li = document.createElement('li'); li.textContent = value; list.append(li); }); section.append(list);
  } else { const paragraph = document.createElement('p'); paragraph.textContent = content; section.append(paragraph); }
  container.append(section);
}
document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.case]; if (!project) return;
  dialogTrigger = button;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-intro').textContent = project.intro;
  const content = document.querySelector('#dialog-content'); content.replaceChildren();
  addSection(content, 'O problema', project.problem); addSection(content, 'A abordagem', project.approach);
  addSection(content, 'O resultado', project.result); addSection(content, 'Decisões de engenharia', project.decisions);
  addSection(content, 'Limites e contexto', project.limits);
  const links = document.querySelector('#dialog-links'); links.replaceChildren();
  project.links.forEach(([label, url]) => { const link = document.createElement('a'); link.textContent = label + ' ↗'; link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link); });
  dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = 'hidden'; document.querySelector('#close-dialog').focus();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; if (dialogTrigger && !dialogTrigger.closest('[hidden]')) dialogTrigger.focus(); });

const scenarios = {
  complete: { result: 'Pronto para conferência humana', descriptions: [
    ['Contexto reunido e projetado.', 'Equipamentos, eventos, notas e OCR compõem um pacote sanitizado. Dados fictícios ilustram a entrada.'],
    ['O escopo sustenta a análise.', 'As regras verificam escopo e evidências antes da interpretação. O pacote deste cenário está completo.'],
    ['Interpretação dentro do catálogo.', 'A IA interpreta as notas e propõe uma combinação válida, apoiada pelas evidências; não cria labels.'],
    ['O sistema prepara. A pessoa confere.', 'A classificação e a observação acompanham as evidências para a conferência humana.'] ] },
  missing: { result: 'Evidência insuficiente', descriptions: [
    ['Uma leitura está faltando.', 'O pacote fictício contém uma lacuna. Ela é registrada como não verificada, não como ausência de problema.'],
    ['O escopo é conhecido; a evidência não.', 'As regras identificam a informação que falta. Interpretação não substitui uma leitura necessária.'],
    ['Sem completar o que a fonte não diz.', 'A IA não fabrica evidências para preencher a lacuna. O cenário segue com uma pendência explícita.'],
    ['Pendência objetiva para revisão.', 'O conferente recebe o que falta verificar. Este exemplo não sugere aprovação automática.'] ] },
  outside: { result: 'Fora do escopo', descriptions: [
    ['O contexto descreve outro atendimento.', 'Dados fictícios representam um atendimento que não pertence ao escopo deste fluxo de pré-validação.'],
    ['A regra de escopo interrompe o fluxo.', 'Fora do escopo, o sistema não tenta encaixar o atendimento em uma classificação que não se aplica.'],
    ['O modelo não precisa ser chamado.', 'A verificação determinística já resolveu o encaminhamento. Não é necessário interpretar este pacote com IA.'],
    ['Encaminhamento transparente.', 'O resultado comunica o limite do fluxo. Nenhuma OS real é consultada ou alterada por esta demonstração.'] ] }
};
const stageNames = ['DADOS', 'REGRAS', 'IA', 'CONFERÊNCIA'];
let stage = 3;
const scenario = document.querySelector('#scenario');
function renderScenario() {
  const selected = scenarios[scenario.value] || scenarios.complete;
  document.querySelector('#stage-label').textContent = `0${stage + 1} / ${stageNames[stage]}`;
  document.querySelector('#stage-title').textContent = selected.descriptions[stage][0];
  document.querySelector('#stage-description').textContent = selected.descriptions[stage][1];
  const result = document.querySelector('#scenario-result'); result.dataset.result = scenario.value;
  result.querySelector('strong').textContent = selected.result;
  document.querySelectorAll('[data-stage]').forEach(button => { const active = Number(button.dataset.stage) === stage; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
}
scenario.addEventListener('change', renderScenario);
document.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => { stage = Number(button.dataset.stage); renderScenario(); }));
renderScenario();

const feedback = document.querySelector('#feedback'); let feedbackTimeout;
function announce(message) {
  clearTimeout(feedbackTimeout); feedback.textContent = message; feedback.classList.add('visible');
  feedbackTimeout = setTimeout(() => feedback.classList.remove('visible'), 4000);
}
document.querySelector('#copy-email').addEventListener('click', async () => {
  const address = 'joaovictorfaraco@gmail.com';
  try { await navigator.clipboard.writeText(address); announce('E-mail copiado.'); }
  catch { announce('E-mail: ' + address + '. Use o link para abrir seu aplicativo de e-mail.'); }
});
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); } }), { threshold: .06 });
  document.querySelectorAll('.reveal').forEach(element => reveals.observe(element));
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navigation.querySelectorAll('a').forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }), { rootMargin: '-12% 0px -70% 0px' });
  document.querySelectorAll('main>section[id],main>.process-section').forEach(section => navObserver.observe(section));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
let scrollPending = false;
function updateProgress() {
  const length = root.scrollHeight - window.innerHeight;
  document.querySelector('#reading-progress').style.transform = `scaleX(${length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 0})`;
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress); updateProgress();
document.querySelector('.site-header').classList.add('enhanced-header'); root.classList.add('enhanced');
