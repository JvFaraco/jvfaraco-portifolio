// Central switch for optional motion. An effect registers start(); start returns its teardown.
// Teardowns must leave content in its final, visible state.
const effects = [];
let enabled = false;

export function onMotion(start) {
  const effect = { start, stop: null };
  effects.push(effect);
  if (enabled) effect.stop = start() || null;
}

export function setMotion(value) {
  if (value === enabled) return;
  enabled = value;
  for (const effect of effects) {
    if (enabled) effect.stop = effect.start() || null;
    else { effect.stop?.(); effect.stop = null; }
  }
  // One-off scripted animations (e.g. filter FLIP) jump to their end state on pause.
  if (!enabled) document.getAnimations?.().forEach(animation => {
    if (!(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition)) animation.finish();
  });
}
