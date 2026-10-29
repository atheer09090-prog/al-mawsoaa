/* Homepage-only interactions: photographic carousel, real search and quick tools. */
(() => {
  'use strict';

  function createHeroSlider(nodes, environment = window) {
    const {root, page, slides, dots, previous, next, pause, caption, status} = nodes;
    if (!root || !page || !slides.length) return null;
    const doc = environment.document;
    const preference = environment.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, timer = 0, userPaused = false, hovered = false, focused = false, visible = true;

    const stop = () => { if (timer) environment.clearTimeout(timer); timer = 0; };
    const canPlay = () => !preference.matches && !userPaused && !hovered && !focused && visible && !doc.hidden && !doc.documentElement?.classList.contains('splash-on') && page.classList.contains('is-active');
    function sync() {
      stop();
      const playing = canPlay();
      root.setAttribute('data-playing', String(playing));
      pause.disabled = preference.matches;
      pause.setAttribute('aria-pressed', String(userPaused || preference.matches));
      pause.setAttribute('aria-label', preference.matches ? 'العرض التلقائي متوقف لتفضيل تقليل الحركة' : userPaused ? 'تشغيل العرض التلقائي' : 'إيقاف العرض التلقائي');
      pause.querySelector('span').textContent = userPaused || preference.matches ? '▶' : 'Ⅱ';
      if (playing) timer = environment.setTimeout(() => { timer = 0; show(index + 1); }, 7000);
    }
    function show(value, manual = false) {
      index = (value + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
        slide.setAttribute('aria-hidden', String(i !== index));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', String(i === index));
      });
      caption.textContent = slides[index].dataset.caption;
      if (manual) status.textContent = `المشهد ${index + 1} من ${slides.length}: ${slides[index].dataset.caption}`;
      sync();
    }
    previous.addEventListener('click', () => show(index - 1, true));
    next.addEventListener('click', () => show(index + 1, true));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
    pause.addEventListener('click', () => { userPaused = !userPaused; focused = false; sync(); });
    root.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovered = true; sync(); } });
    root.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovered = false; sync(); } });
    root.addEventListener('focusin', () => { focused = true; sync(); });
    root.addEventListener('focusout', () => environment.setTimeout(() => { focused = root.contains(doc.activeElement); sync(); }, 0));
    preference.addEventListener('change', sync);
    doc.addEventListener('visibilitychange', sync);
    doc.addEventListener('omani:routechange', sync);
    if (environment.MutationObserver && doc.documentElement) {
      new environment.MutationObserver(sync).observe(doc.documentElement, {attributes:true, attributeFilter:['class']});
    }
    if (environment.IntersectionObserver) {
      const observer = new environment.IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold: .05});
      observer.observe(root);
    }
    show(0);
    return {show, sync};
  }

  function initHome() {
    const $ = selector => document.querySelector(selector);
    const root = $('#homeHero');
    if (!root) return;
    createHeroSlider({root, page: $('#page-home'), slides: [...root.querySelectorAll('.discovery-slide')], dots: [...root.querySelectorAll('[data-hero-slide]')], previous: $('#heroPrev'), next: $('#heroNext'), pause: $('#heroPause'), caption: $('#heroLocation'), status: $('#heroSlideStatus')});

    const search = query => document.dispatchEvent(new CustomEvent('omani:search', {detail: {query: query.trim()}}));
    $('#heroSearch').addEventListener('submit', e => { e.preventDefault(); search($('#heroSearchInput').value); });
    root.querySelectorAll('[data-home-query]').forEach(button => button.addEventListener('click', () => search(button.dataset.homeQuery)));

    function updateDate() {
      const now = new Date();
      const format = options => new Intl.DateTimeFormat('ar-OM-u-nu-arab', {timeZone: 'Asia/Muscat', ...options}).format(now);
      $('#homeDay').textContent = format({day: 'numeric'});
      $('#homeWeekday').textContent = format({weekday: 'long'});
      $('#homeMonth').textContent = format({month: 'long', year: 'numeric'});
    }
    updateDate();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) updateDate(); });

    const places = new Set(['mountain-winter', 'darbat-green', 'green-turtles']);
    $('#homeGovernorate').addEventListener('change', e => {
      if (places.has(e.target.value)) $('#homeGovernorateLink').setAttribute('href', '#journey/' + e.target.value);
    });
  }

  window.OmaniHome = {createHeroSlider};
  document.addEventListener('DOMContentLoaded', initHome);
})();
