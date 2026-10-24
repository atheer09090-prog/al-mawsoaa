'use strict';
// Scene destinations and answer wording come directly from the supplied PowerPoint.
const scene = document.querySelector('#scene');
const actions = document.querySelector('#actions');
const status = document.querySelector('#status');
const home = document.querySelector('#home');
let scenes = [], revision = 0;
const questions = [4, 5, 12, 13, 20, 21, 28, 29];
function button(label, target, primary = false) {
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = label;
  if (primary) b.className = 'primary';
  b.addEventListener('click', () => show(target));
  return b;
}
function show(number, initial = false) {
  const entry = scenes[number - 1];
  if (!entry) return;
  revision++;
  scene.querySelector('video')?.pause();
  scene.replaceChildren(); actions.replaceChildren(); status.textContent = '';
  scene.setAttribute('aria-busy', 'false');
  scene.dataset.scene = String(number);
  home.hidden = number === 1;
  if (number === 1) {
    const intro = document.createElement('div'); intro.className = 'intro';
    const image = document.createElement('img'); image.src = 'museum/' + entry.poster; image.alt = 'شخصيتا اللعبة أمام متحف عُمان';
    const copy = document.createElement('div'); copy.className = 'intro-copy';
    const title = document.createElement('p'); title.textContent = 'لعبة متحف عُمان';
    const start = document.createElement('button'); start.type = 'button'; start.className = 'primary'; start.textContent = 'ابدأ الرحلة';
    start.addEventListener('click', () => playScene(entry));
    copy.append(title, start); intro.append(image, copy); scene.append(intro);
  } else if (entry.question) {
    const box = document.createElement('section'); box.className = 'question';
    const count = document.createElement('p'); count.className = 'question-count';
    count.textContent = `السؤال ${new Intl.NumberFormat('ar-OM').format(questions.indexOf(number) + 1)} من ٨`;
    const title = document.createElement('h2'); title.textContent = entry.question; title.tabIndex = -1;
    const answers = document.createElement('div'); answers.className = 'answers';
    entry.answers.forEach(answer => {
      const b = button(answer.label, answer.target); b.className = 'answer'; answers.append(b);
    });
    box.append(count, title, answers); scene.append(box);
    if (!initial) title.focus({preventScroll:true});
  } else playScene(entry);
}
function playScene(entry) {
  const token = ++revision;
  scene.replaceChildren(); actions.replaceChildren();
  scene.dataset.scene = String(entry.slide);
  const video = document.createElement('video');
  video.controls = true; video.playsInline = true; video.preload = 'metadata';
  video.poster = 'museum/' + entry.poster;
  video.src = 'museum/' + entry.media;
  video.setAttribute('aria-label', entry.slide === 1 ? 'مقدمة لعبة متحف عُمان' : 'مشهد من لعبة متحف عُمان');
  const box = document.createElement('div'); box.className = 'video-scene'; box.append(video); scene.append(box);
  const next = entry.actions.find(a => a.target !== 1);
  if (next) {
    const retry = next.target < entry.slide;
    actions.append(button(retry ? 'حاول مجددًا' : 'متابعة الرحلة', next.target, true));
  } else if (entry.slide === 35) actions.append(button('إعادة اللعب', 1, true));
  const replay = document.createElement('button'); replay.type = 'button'; replay.textContent = 'إعادة المقطع';
  replay.addEventListener('click', () => { video.currentTime = 0; play(); }); actions.append(replay);
  video.addEventListener('error', () => { if (token === revision) status.textContent = 'تعذّر تحميل المقطع. أعد المحاولة أو نزّل لعبة PowerPoint من نافذة الموقع.'; });
  video.addEventListener('playing', () => { if (token === revision) status.textContent = ''; });
  const play = () => video.play()?.catch(() => { if (token === revision) status.textContent = 'اضغط زر التشغيل داخل المقطع للاستماع والمشاهدة.'; });
  play();
}
home.addEventListener('click', () => show(1));
fetch('museum/scenes.json').then(r => {
  if (!r.ok) throw new Error('Scene data unavailable');
  return r.json();
}).then(data => { scenes = data; show(1, true); }).catch(() => {
  scene.setAttribute('aria-busy', 'false');
  scene.innerHTML = '<p class="error">تعذّر تجهيز اللعبة. أعد تحميل الصفحة أو <a href="oman-museum.pptx" download>نزّل لعبة PowerPoint</a>.</p>';
});
