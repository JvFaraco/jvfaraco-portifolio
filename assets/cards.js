import { onMotion } from './motion.js';

const cards = [...document.querySelectorAll('.project-card')];
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

// Thumb animations play only while their card is on screen.
onMotion(() => {
  const visibility = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting)));
  cards.forEach(card => visibility.observe(card));
  return () => { visibility.disconnect(); cards.forEach(card => card.classList.remove('in-view')); };
});

// Light tilt and a spotlight that follows the pointer; mouse and trackpad only.
onMotion(() => {
  if (!finePointer.matches) return;
  const cleanups = cards.map(card => {
    const spot = document.createElement('span'); spot.className = 'card-spot'; spot.setAttribute('aria-hidden', 'true');
    card.append(spot);
    const move = event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      card.style.transform = `perspective(900px) rotateX(${((.5 - y / rect.height) * 5).toFixed(2)}deg) rotateY(${((x / rect.width - .5) * 5).toFixed(2)}deg) translateY(-4px)`;
      spot.style.transform = `translate(${x - 130}px, ${y - 130}px)`;
    };
    const leave = () => { card.style.transform = ''; };
    card.addEventListener('pointermove', move); card.addEventListener('pointerleave', leave);
    return () => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); spot.remove(); card.style.transform = ''; };
  });
  return () => cleanups.forEach(cleanup => cleanup());
});
