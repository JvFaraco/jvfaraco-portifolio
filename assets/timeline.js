import { onMotion } from './motion.js';

const timeline = document.querySelector('.timeline');
const items = [...timeline.querySelectorAll('.timeline-item')];

// The experience line draws itself as the reader scrolls; each role lights up when the line reaches it.
onMotion(() => {
  const rail = document.createElement('span');
  rail.className = 'timeline-rail'; rail.setAttribute('aria-hidden', 'true');
  timeline.prepend(rail);
  let pending = false;
  const update = () => {
    pending = false;
    const rect = timeline.getBoundingClientRect(), reach = window.innerHeight * .7 - rect.top;
    const progress = Math.min(1, Math.max(0, reach / rect.height));
    rail.style.transform = `scaleY(${progress.toFixed(3)})`;
    items.forEach(item => item.classList.toggle('passed', item.offsetTop + 12 <= reach));
  };
  const onScroll = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll); update();
  return () => {
    window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll);
    rail.remove(); items.forEach(item => item.classList.remove('passed'));
  };
});
