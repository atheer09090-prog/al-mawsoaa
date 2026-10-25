/* Shared page transitions survive independently of the year journey. */
(() => {
'use strict';
window.OmaniMotion = {run(update,kind = 'page') {
  const root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !document.startViewTransition || root.dataset.viewTransition) { update(); return; }
  root.dataset.viewTransition = kind;
  try {
    const transition = document.startViewTransition(update);
    transition.finished.catch(() => {}).finally(() => { delete root.dataset.viewTransition; });
  } catch { delete root.dataset.viewTransition; update(); }
}};
})();
