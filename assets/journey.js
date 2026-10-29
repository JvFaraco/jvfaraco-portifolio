import { onMotion } from './motion.js';

const journey = document.querySelector('.journey');
const steps = [...journey.querySelectorAll('.journey-step')];
const vertical = window.matchMedia('(max-width: 900px)');

// A rail fills as the reader scrolls through the three moments; each moment activates as it enters the screen.
onMotion(() => {
  const rail = document.createElement('span');
  rail.className = 'journey-rail'; rail.setAttribute('aria-hidden', 'true');
  journey.prepend(rail); journey.classList.add('live');
  let pending = false;
  const update = () => {
    pending = false;
    const rect = journey.getBoundingClientRect(), viewport = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (viewport * .8 - rect.top) / (rect.height + viewport * .3)));
    rail.style.transform = vertical.matches ? `scaleY(${progress.toFixed(3)})` : `scaleX(${progress.toFixed(3)})`;
    // Each moment wakes when it reaches the screen, so dimmed text never sits in view.
    steps.forEach(step => step.classList.toggle('is-active', step.getBoundingClientRect().top < viewport * .88));
  };
  const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll); update();
  return () => {
    window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
    rail.remove(); journey.classList.remove('live'); steps.forEach(step => step.classList.remove('is-active'));
  };
});
