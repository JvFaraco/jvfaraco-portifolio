import { onMotion } from './motion.js';

const root = document.documentElement;
const home = document.querySelector('#home');
const subtitle = document.querySelector('#typing-animation');
const photo = document.querySelector('.hero-photo img');
const wide = window.matchMedia('(min-width: 901px)');

// Subtitle is typed once per load. The full text stays readable through the sr-only copy;
// pausing completes it and resuming does not replay it.
let typed = false;
onMotion(() => {
  if (typed) return;
  typed = true;
  const text = subtitle.textContent.trim();
  const readable = document.createElement('span'); readable.className = 'sr-only'; readable.textContent = text;
  const visual = document.createElement('span'); visual.setAttribute('aria-hidden', 'true');
  const chars = [...text].map(char => {
    const span = document.createElement('span'); span.className = 'typed-char'; span.textContent = char;
    visual.append(span); return span;
  });
  subtitle.replaceChildren(readable, visual); subtitle.classList.add('typing');
  const step = Math.min(40, 1200 / chars.length);
  let index = 0, timer;
  const finish = () => {
    clearTimeout(timer); chars.forEach(char => char.classList.add('on')); chars[index - 1]?.classList.remove('caret');
    subtitle.classList.remove('typing'); subtitle.classList.add('typed');
  };
  const tick = () => {
    chars[index - 1]?.classList.remove('caret'); chars[index].classList.add('on', 'caret'); index++;
    if (index < chars.length) timer = setTimeout(tick, step); else finish();
  };
  timer = setTimeout(tick, 450);
  return finish;
});

// Light parallax on the photo, desktop only.
onMotion(() => {
  if (!wide.matches) return;
  let pending = false;
  const update = () => {
    pending = false;
    const shift = Math.min(window.scrollY, window.innerHeight) / window.innerHeight * 18;
    photo.style.transform = `translateY(${shift.toFixed(1)}px) scale(1.06)`;
  };
  const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true }); update();
  return () => { window.removeEventListener('scroll', onScroll); photo.style.transform = ''; };
});

// "Data flow" background: drifting nodes, links between close ones and packets travelling on them.
// Runs only while the hero is on screen and the tab is visible; lighter on small screens.
onMotion(() => {
  const small = !wide.matches;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-flow'; canvas.setAttribute('aria-hidden', 'true'); canvas.dataset.running = 'false';
  home.prepend(canvas);
  const context = canvas.getContext('2d');
  const count = small ? 16 : 34, reach = small ? 110 : 150, frameGap = 1000 / (small ? 30 : 60);
  let width = 0, height = 0, nodes = [], packets = [], colors = {}, raf = 0, last = 0, spawn = 0, onScreen = true, started = false;

  const readColors = () => {
    const style = getComputedStyle(root);
    colors = { line: style.getPropertyValue('--flow-line').trim(), node: style.getPropertyValue('--flow-node').trim(), packet: style.getPropertyValue('--yellow').trim() };
  };
  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    width = home.clientWidth; height = home.clientHeight;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!nodes.length) nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
    }));
  };
  const draw = now => {
    raf = requestAnimationFrame(draw);
    if (now - last < frameGap) return;
    const elapsed = Math.min(now - last, 100); last = now;
    context.clearRect(0, 0, width, height);
    for (const node of nodes) {
      node.x += node.vx * elapsed / 16; node.y += node.vy * elapsed / 16;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }
    const links = [];
    context.strokeStyle = colors.line; context.lineWidth = 1;
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) {
      const distance = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
      if (distance > reach) continue;
      links.push([a, b]);
      context.globalAlpha = 1 - distance / reach;
      context.beginPath(); context.moveTo(nodes[a].x, nodes[a].y); context.lineTo(nodes[b].x, nodes[b].y); context.stroke();
    }
    context.globalAlpha = 1; context.fillStyle = colors.node;
    for (const node of nodes) { context.beginPath(); context.arc(node.x, node.y, 2, 0, Math.PI * 2); context.fill(); }
    spawn += elapsed;
    if (spawn > 700 && links.length && packets.length < 6) { spawn = 0; const [a, b] = links[Math.floor(Math.random() * links.length)]; packets.push({ a, b, t: 0 }); }
    context.fillStyle = colors.packet;
    packets = packets.filter(packet => {
      packet.t += elapsed / 1400;
      const from = nodes[packet.a], to = nodes[packet.b];
      context.beginPath(); context.arc(from.x + (to.x - from.x) * packet.t, from.y + (to.y - from.y) * packet.t, 2.4, 0, Math.PI * 2); context.fill();
      return packet.t < 1;
    });
  };
  const run = () => {
    const should = started && onScreen && !document.hidden;
    if (should && !raf) { last = performance.now(); raf = requestAnimationFrame(draw); }
    if (!should && raf) { cancelAnimationFrame(raf); raf = 0; }
    canvas.dataset.running = String(!!raf);
  };
  const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; run(); });
  const sizes = new ResizeObserver(resize);
  const theme = new MutationObserver(readColors);
  // Start after load so the canvas never competes with the hero image.
  const begin = () => { started = true; readColors(); resize(); visibility.observe(home); sizes.observe(home); theme.observe(root, { attributes: true, attributeFilter: ['data-theme'] }); run(); };
  const pendingStart = setTimeout(() => document.readyState === 'complete' ? begin() : window.addEventListener('load', begin, { once: true }), 0);
  document.addEventListener('visibilitychange', run);
  return () => {
    clearTimeout(pendingStart); window.removeEventListener('load', begin);
    started = false; run(); visibility.disconnect(); sizes.disconnect(); theme.disconnect();
    document.removeEventListener('visibilitychange', run); canvas.remove();
  };
});
