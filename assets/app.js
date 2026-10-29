import { projects } from './projects.js';
import { setMotion } from './motion.js';

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
// Optional effects are fetched only the first time motion is on.
const effectModules = ['./hero.js'];
let effectsLoaded = false;

function syncTheme() {
  themeToggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === 'dark' ? '#0a0f1e' : '#f0f4ff';
}
function syncMotion() {
  const off = motionPaused || reducedMotion.matches;
  root.dataset.motion = off ? 'off' : 'on';
  motionToggle.textContent = off ? 'Animações pausadas' : 'Pausar animações';
  motionToggle.setAttribute('aria-pressed', String(off));
  motionToggle.disabled = reducedMotion.matches;
  motionToggle.title = reducedMotion.matches ? 'Movimento reduzido conforme a preferência do sistema' : 'Alternar animações';
  setMotion(!off);
  if (!off && !effectsLoaded) { effectsLoaded = true; effectModules.forEach(path => import(path)); }
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
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

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
  const backTop = document.querySelector('#backTop');
  backTop.hidden = window.scrollY <= 400;
  backTop.classList.toggle('visible', !backTop.hidden);
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress); updateProgress();
document.querySelector('.site-header').classList.add('enhanced-header'); root.classList.add('enhanced');
