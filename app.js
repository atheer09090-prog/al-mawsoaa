(() => {
'use strict';

/* ---------- Data ---------- */
const SECTIONS = [
  {id:'library', title:'المكتبة المرئية', desc:'فيديوهات ومواد مرئية تُقرّب موضوعات الموسوعة إلى الصف، وتفتح مساحة للمشاهدة والحوار.', short:'فيديوهات ومحتوى مرئي مرتبط بالموسوعة.', kind:'فيديو', label:'شاهد واكتشف'},
  {id:'podcasts', title:'البودكاست', desc:'حوارات طلابية مصوّرة؛ أصوات من المدرسة تفتح نوافذ على المجتمع والثقافة العُمانية.', short:'حوارات مصوّرة بأصوات طالبات مدرسة غدو.', kind:'حلقة بودكاست', label:'شاهد الحلقات'},
  {id:'presentations', title:'العروض التقديمية', desc:'عروض تقديمية تعليمية تساعد على عرض موضوعات الموسوعة ومناقشتها بصريًا داخل الحصة.', short:'عروض تقديمية تعليمية قابلة للمعاينة والتنزيل.', kind:'عرض', label:'تصفّح العروض'},
  {id:'play', title:'الألعاب التفاعلية', desc:'ألعاب وأنشطة رقمية تفاعلية تجعل استكشاف المعرفة تجربة مشاركة واكتشاف.', short:'ألعاب وأنشطة رقمية تفاعلية للتعلّم بالاكتشاف.', kind:'لعبة', label:'ابدأ التعلّم'},
  {id:'practice', title:'من المعرفة إلى التطبيق', desc:'تجارب وممارسات مصوّرة من التراث والحياة العُمانية، في فيديوهات غير مصنوعة بالذكاء الاصطناعي.', short:'فيديوهات واقعية تصل المعرفة بالتجربة والممارسة.', kind:'تطبيق عملي', label:'شاهد التطبيق'},
  {id:'student-presentations', title:'سفراء المعرفة', desc:'عروض شفوية يقدّمها طلاب المدرسة عن كنوز عُمان ومعارفها.', short:'عروض شفوية من طلاب المدرسة.', kind:'عرض شفهي', label:'شاهد عروض الطلاب'},
  {id:'booklets', title:'المطويات', desc:'مواد تعريفية مختصرة للقراءة والمعاينة والتنزيل، مصممة لتكون قريبة من المتعلم.', short:'مطويات ومواد تعريفية للقراءة والتنزيل.', kind:'مطوية', label:'اقرأ المطويات'},
  {id:'school', title:'أنشطة التفعيل', desc:'مساحة للورش والمبادرات والمسابقات والأفكار الصفية التي تفعّل موارد الموسوعة في المدرسة.', short:'أنشطة ومبادرات لتفعيل الموسوعة في البيئة المدرسية.', kind:'نشاط', label:'فعّل المعرفة'}
];
const CRAFTS = [
  {id:'halwa',hash:'workshop/halwa',root:'workshopRoot',heading:'workshopTitle',api:'OmaniWorkshop',title:'صناعة الحلوى العُمانية',short:'صناعة الحلوى',kicker:'المذاق والضيافة',words:'حلوى طبخ محاكاة',image:'halwa/entry.webp',width:480,height:480,alt:'حلوى عُمانية بالزعفران',description:'أضف المكونات، وحرّك، ثم قدّم الحلوى.',files:['data/halwa.js','workshop.js']},
  {id:'frankincense',hash:'workshop/frankincense',root:'frankincenseRoot',heading:'frTitle',api:'OmaniFrankincense',title:'استخراج اللبان العُماني',short:'استخراج اللبان',kicker:'الشجرة والاستدامة',words:'لبان شجرة ظفار استدامة',image:'frankincense/entry.webp',width:640,height:360,alt:'أشجار لبان في وادي دوكة',description:'انقش برفق، وانتظر، ثم اجمع اللبان.',files:['data/frankincense.js','frankincense.js']},
  {id:'sadu',hash:'workshop/sadu',root:'saduRoot',heading:'saduTitle',api:'OmaniSadu',title:'غزل السدو ونسجه',short:'غزل السدو',kicker:'الصوف والنسيج',words:'صوف مغزل نول حياكة نسج سدو',image:'sadu/reference.webp',width:1024,height:518,alt:'نقوش السدو في مفروشات مجلس في الإمارات',description:'جهّز الصوف، واغزل الخيط، ثم انسج السدو.',files:['data/textile-pottery.js','workshop-craft-draw.js','textile-pottery.js']},
  {id:'pottery',hash:'workshop/pottery',root:'potteryRoot',heading:'potteryTitle',api:'OmaniPottery',title:'صناعة الفخار',short:'صناعة الفخار',kicker:'الطين والإبداع',words:'طين خزف دولاب بهلاء تشكيل فخار',image:'pottery/reference.webp',width:1024,height:683,alt:'حرفي يشكّل وعاءً فخاريًا في سلطنة عُمان',description:'اعجن الطين، وشكّل الوعاء، ثم جفّف واحرق.',files:['data/textile-pottery.js','workshop-craft-draw.js','textile-pottery.js']}
];
const STEPS = [
  {lead:'اختر ما يناسب درسك:', sections:['library','podcasts','presentations','booklets']},
  {lead:'تعلّم وشارك المعرفة:', sections:['play','practice','student-presentations']},
  {lead:'امتد بالمعرفة إلى المدرسة:', sections:['school']}
];
const TITLE = 'الموسوعة العُمانية | معرفة تنبض بعُمان';
const rawContent = window.OMANI_CONTENT;
const dataOk = Array.isArray(rawContent);
const byId = id => SECTIONS.find(s => s.id === id);
const content = dataOk ? rawContent.filter(x => x && x.id && x.title && byId(x.section)) : [];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico = (name, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
let nf; try { nf = new Intl.NumberFormat('ar-OM-u-nu-arab'); } catch { nf = new Intl.NumberFormat('ar'); }
const num = n => nf.format(n);
const countLabel = n => n === 0 ? 'لا مواد بعد' : n === 1 ? 'مادة واحدة' : n === 2 ? 'مادتان' : n <= 10 ? `${num(n)} مواد` : `${num(n)} مادة`;
const norm = s => String(s ?? '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[إأآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
const haystack = x => norm(`${x.title} ${x.description || ''} ${x.audience || ''} ${x.category || ''}`);
const inSection = id => content.filter(x => x.section === id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
};
const savedViewed = store.get('omani-viewed', []);
const viewed = new Set(Array.isArray(savedViewed) ? savedViewed.filter(id => typeof id === 'string') : []);
const isNew = item => {
  const t = Date.parse(item.added);
  return Number.isFinite(t) && Date.now() - t >= 0 && Date.now() - t < 30 * 864e5;
};

/* ---------- Toast ---------- */
let toastTimer;
function toast(message, type = 'success') {
  const t = $('#toast');
  t.className = 'toast' + (type === 'error' ? ' is-error' : '');
  t.innerHTML = `${ico(type === 'error' ? 'alert' : 'check')}<span>${esc(message)}</span>`;
  requestAnimationFrame(() => t.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 3000);
}

/* ---------- Home: facade ---------- */
const sectionImage = id => id === 'practice' ? 'assets/content/covers/omani-drum.webp' : `assets/images/${id}.webp`;
const sectionImageSet = id => id === 'practice' ? '' : `srcset="assets/images/${id}-small.webp 640w, ${sectionImage(id)} ${id === 'student-presentations' ? 1600 : 1280}w" sizes="136px"`;
const IMAGE_ALT = {practice:'لقطة من فيديو الطبل العربي في التراث العُماني', library:'طالب عُماني يقرأ كتابًا في مكتبة المدرسة', presentations:'طالبة تعرض درسًا على الشاشة الصفية', play:'طالبات يتعلمن معًا باستخدام جهاز لوحي', 'student-presentations':'طالبة عُمانية تحمل كتاب الموسوعة بين رفوف المكتبة', booklets:'كتب الموسوعة العُمانية مفتوحة على طاولة القراءة', school:'طالبة تشرح موضوعًا من الموسوعة أمام شاشة الصف'};
function responsiveCover(source, sizes = '(max-width: 560px) calc(100vw - 32px), (max-width: 960px) 46vw, 370px') {
  const image = window.OMANI_IMAGES?.[source];
  if (!image) return `src="${esc(source)}" decoding="async"`;
  return `src="${esc(image.src)}" ${image.srcset ? `srcset="${esc(image.srcset)}" sizes="${sizes}"` : ''} width="${image.width}" height="${image.height}" decoding="async"`;
}
function bindImageReveal(root = document) {
  $$('.hero-image, .collection-image, .resource-cover-image, .section-tile-image', root).forEach(img => {
    const finish = () => img.classList.add(img.naturalWidth ? 'is-loaded' : 'is-failed');
    if (img.complete) finish();
    else {
      img.addEventListener('load', finish, {once:true});
      img.addEventListener('error', finish, {once:true});
    }
  });
}
function podcastPortrait(item, imageClass) {
  const zoom = Math.min(3, Math.max(1, Number(item.coverCrop?.zoom) || 1.5));
  const y = Number(item.coverCrop?.y ?? 50);
  const position = Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50;
  return `<div class="podcast-portrait" style="--portrait-zoom:${zoom};--portrait-y:${position}%"><img class="${imageClass}" ${responsiveCover(item.cover, imageClass === 'section-tile-image' ? '54px' : '(max-width: 560px) 85vw, 315px')} alt="صورة ضيفة حلقة ${esc(item.title)}" loading="lazy"></div>`;
}
function renderBays() {
  $('#sectionCaption').textContent = `${num(SECTIONS.length)} أبواب · ${countLabel(content.length)}`;
  $('#bays').innerHTML = SECTIONS.map((s, i) => {
    const total = inSection(s.id).length;
    const image = s.id === 'podcasts'
      ? `<div class="section-tile-portraits">${inSection(s.id).filter(item => item.cover).slice(0,2).map(item => podcastPortrait(item, 'section-tile-image')).join('')}</div>`
      : s.id === 'practice' ? `<img class="section-tile-image" ${responsiveCover(sectionImage(s.id),'136px')} alt="${IMAGE_ALT[s.id]}" loading="lazy">`
      : `<img class="section-tile-image" src="${sectionImage(s.id)}" ${sectionImageSet(s.id)} width="${s.id === 'student-presentations' ? 1600 : 1280}" height="${s.id === 'student-presentations' ? 900 : 720}" alt="${IMAGE_ALT[s.id]}" loading="lazy" decoding="async">`;
    return `<article class="knowledge-item reveal" style="--i:${i}" role="listitem">
      <a class="section-tile" href="#${s.id}" aria-label="${esc(s.title)} — ${countLabel(total)}">
        <div class="section-tile-media">${image}</div>
        <div class="section-tile-body"><div class="section-tile-meta"><span class="section-tile-icon">${ico(s.id)}</span><span>${countLabel(total)}</span></div>
          <h3>${s.title}</h3><p>${s.short}</p><span class="section-tile-action">${s.label}${ico('arrow')}</span>
        </div>
      </a></article>`;
  }).join('');
  $('#bays').setAttribute('aria-busy','false');
  bindImageReveal($('#bays'));
  $('#footerNav').innerHTML = SECTIONS.map(s => `<a href="#${s.id}">${s.title}</a>`).join('') + '<a href="#workshop">ورشة الحِرف</a>'+CRAFTS.map(c=>`<a href="#${c.hash}">${c.title}</a>`).join('')+'<a href="#journey">رحلة عام في عُمان</a><a href="#image-credits">مصادر الصور</a>';
  renderCraftLinks();
}

function renderCraftLinks(){
  const image=c=>`<img src="assets/images/workshop/${c.image}" width="${c.width}" height="${c.height}" alt="${esc(c.alt)}" loading="lazy" decoding="async">`;
  $('#craftEntryLinks').innerHTML=CRAFTS.map(c=>`<a href="#${c.hash}">${image(c)}<span>${c.short}<b>ابدأ ←</b></span></a>`).join('');
  $('#workshopHubGrid').innerHTML=CRAFTS.map(c=>`<a class="workshop-hub-card" data-craft="${c.id}" href="#${c.hash}">${image(c)}<div><small>${c.kicker}</small><h2>${c.title}</h2><p>${c.description}</p><span>ادخل التجربة ←</span></div></a>`).join('');
}

function renderRecent() {
  // Resources already live in their own sections; keep the legacy container
  // hidden so the home page does not repeat the same cards a second time.
  const section = $('#recentSection');
  if (section) section.hidden = true;
}

/* ---------- Stepper ---------- */
function setStep(i, focus) {
  const tabs = $$('.step-tab');
  tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  $('#stepper').style.setProperty('--fill', i / (tabs.length - 1));
  const panel = $('#stepPanel');
  panel.setAttribute('aria-labelledby', `step-tab-${i}`);
  panel.innerHTML = `<p>${STEPS[i].lead}</p><div class="step-chips">${STEPS[i].sections.map(id => {
    const s = byId(id), n = inSection(id).length;
    return `<a class="step-chip" href="#${id}">${ico(id)}${s.title}<small>${n ? countLabel(n) : 'قريبًا'}</small></a>`;
  }).join('')}</div>`;
  panel.classList.remove('is-swapping'); void panel.offsetWidth; panel.classList.add('is-swapping');
  if (focus) tabs[i].focus();
}
function initStepper() {
  const tabs = $$('.step-tab');
  tabs.forEach((t, i) => t.addEventListener('click', () => setStep(i)));
  $('.step-tabs').addEventListener('keydown', e => {
    const cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const next = {ArrowLeft:1, ArrowDown:1, ArrowRight:-1, ArrowUp:-1}[e.key];
    if (next) { e.preventDefault(); setStep((cur + next + tabs.length) % tabs.length, true); }
    if (e.key === 'Home') { e.preventDefault(); setStep(0, true); }
    if (e.key === 'End') { e.preventDefault(); setStep(tabs.length - 1, true); }
  });
  setStep(0);
}

/* ---------- Resource cards ---------- */
function actionLabel(i) {
  const ext = (i.file || i.attachment || '').split('?')[0].split('.').pop().toLowerCase();
  if (i.section === 'podcasts') return 'شاهد الحلقة';
  if (['mp4','webm','ogg'].includes(ext)) return 'شاهد الفيديو';
  if (i.section === 'play' && i.url && !i.embed) return 'افتح اللعبة';
  return i.section === 'play' ? 'ابدأ اللعب' : i.section === 'library' || (i.section === 'presentations' && ['mp4','webm','ogg'].includes(ext)) ? 'شاهد الفيديو' : i.section === 'presentations' ? 'عاين العرض'
    : i.section === 'booklets' ? 'عاين المادة' : (i.attachment ? 'عرض المرفق' : 'تفاصيل النشاط');
}
function resourceCard(item, i = 0) {
  const s = byId(item.section);
  const seen = viewed.has(item.id);
  const cover = item.cover
    ? item.section === 'podcasts' ? podcastPortrait(item, 'resource-cover-image') : `<img class="resource-cover-image" ${responsiveCover(item.cover)} alt="غلاف ${esc(item.title)}" loading="lazy">`
    : `<div class="resource-cover" aria-hidden="true">${ico(s.id)}</div>`;
  const badges = `<span class="badge">${s.kind}</span>${seen ? `<span class="badge badge-seen">${ico('check')} اطّلعت</span>` : isNew(item) ? '<span class="badge badge-new">جديد</span>' : ''}`;
  const steps = item.section === 'school' && item.steps?.length
    ? `<details><summary>خطوات التنفيذ</summary><ol>${item.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol></details>` : '';
  const action = item.section === 'play' && item.url && !item.embed
    ? `<a class="resource-action" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" data-external-resource="${esc(item.id)}" aria-label="${esc(item.title)} — تفتح في تبويب جديد">${actionLabel(item)} ${ico('external')}</a>`
    : `<button class="resource-action" type="button" data-resource="${esc(item.id)}">${actionLabel(item)} ${ico('arrow')}</button>`;
  return `<article class="resource-card" data-section="${s.id}" style="--i:${i}"><div class="resource-cover-wrap">${cover}<div class="badges">${badges}</div></div>
    <div class="resource-body"><div class="resource-meta">${esc(item.category || s.title)}${item.audience ? ` · ${esc(item.audience)}` : ''}</div>
    <h3>${esc(item.title)}</h3><p>${esc(item.description || '')}</p>${steps}
    ${action}</div></article>`;
}

/* ---------- Category page ---------- */
const state = {section: null, q: '', cat: '', sort: 'default'};
function sectionItems() {
  let items = inSection(state.section.id);
  if (state.cat) items = items.filter(x => x.category === state.cat);
  const q = norm(state.q.trim());
  if (q) items = items.filter(x => haystack(x).includes(q));
  if (state.sort === 'new') items = [...items].sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  if (state.sort === 'alpha') items = [...items].sort((a, b) => a.title.localeCompare(b.title, 'ar'));
  return items;
}
function renderSection(animate = false) {
  const s = state.section, all = inSection(s.id), items = sectionItems();
  const cats = [...new Set(all.map(x => x.category).filter(Boolean))];
  const toolbar = $('#categoryToolbar');
  toolbar.hidden = !all.length;
  $('#categoryGrid').dataset.section = s.id;
  const chips = $('#chips');
  chips.hidden = cats.length < 2;
  chips.innerHTML = cats.length < 2 ? '' : ['', ...cats].map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${c ? esc(c) : 'الكل'}</button>`).join('');
  $('#resultCount').textContent = toolbar.hidden ? '' : (items.length ? countLabel(items.length) : 'لا نتائج');
  $('#categoryCount').textContent = all.length ? countLabel(all.length) : '';
  // progress
  const seenN = all.filter(x => viewed.has(x.id)).length;
  $('#progressWrap').hidden = !all.length;
  if (all.length) {
    $('#progressLabel').textContent = `اطّلعت على ${num(seenN)} من ${num(all.length)}`;
    const pct = Math.round(seenN / all.length * 100);
    $('#progressBar').setAttribute('aria-valuenow', pct);
    $('#progressBar').style.setProperty('--v', seenN / all.length);
    $('#resetProgress').hidden = !seenN;
  }
  // grid + empty states
  const grid = $('#categoryGrid');
  grid.classList.toggle('is-entering', animate);
  const crafts = CRAFTS.filter(c=>['play','practice'].includes(s.id)&&!state.cat&&(!norm(state.q.trim())||norm('ورشة الحرف كيف تصنع محاكاة تفاعلية '+c.title+' '+c.words).includes(norm(state.q.trim()))));
  grid.innerHTML = crafts.map(c=>`<article class="resource-card workshop-resource-entry"><a href="#workshop/${c.id}"><img src="assets/images/workshop/${c.image}" width="${c.width}" height="${c.height}" alt="${c.alt}" loading="lazy" decoding="async"><div class="resource-body"><span class="resource-meta">كيف تُصنع؟ · تجربة داخل الموقع</span><h3>${c.title}</h3><p>${c.description}</p><span class="resource-action">ابدأ الورشة ${ico('arrow')}</span></div></a></article>`).join('') + items.map((x, i) => resourceCard(x, i)).join('');
  if (crafts.length) $('#resultCount').textContent = (items.length ? $('#resultCount').textContent+' + ' : '')+(crafts.length===1?'ورشة تفاعلية':crafts.length===2?'ورشتان تفاعليتان':num(crafts.length)+' ورش تفاعلية');
  bindImageReveal(grid);
  const empty = $('#emptyState');
  empty.hidden = items.length > 0 || crafts.length > 0;
  if (!items.length && !crafts.length) {
    const actions = $('#emptyActions');
    if (!dataOk) {
      $('#emptyTitle').textContent = 'تعذّر تحميل المحتوى';
      $('#emptyText').textContent = 'لم نتمكن من قراءة بيانات الموارد. أعد تحميل الصفحة وحاول مجددًا.';
      actions.innerHTML = '<button class="button button-primary" type="button" data-reload>أعد المحاولة</button>';
    } else if (all.length) {
      $('#emptyTitle').textContent = 'لا توجد نتائج مطابقة';
      $('#emptyText').textContent = 'جرّب كلمات أخرى أو أزل التصفية لعرض كل مواد القسم.';
      actions.innerHTML = '<button class="button button-ghost" type="button" data-clear>إزالة التصفية</button>';
    } else {
      $('#emptyTitle').textContent = 'قريبًا في هذا القسم';
      $('#emptyText').textContent = 'نعمل على تجهيز موارده التعليمية.';
      actions.innerHTML = `<a class="button button-ghost" href="#collections">تصفّح الأقسام ${ico('arrow')}</a>`;
    }
  }
}
function renderPager() {
  const i = SECTIONS.indexOf(state.section), n = SECTIONS.length;
  const prev = SECTIONS[(i - 1 + n) % n], next = SECTIONS[(i + 1) % n];
  $('#sectionPager').innerHTML =
    `<a class="pager-link prev" href="#${prev.id}">${ico('arrow', 'flip')}<span><small>القسم السابق</small><b>${prev.title}</b></span></a>` +
    `<a class="pager-link next" href="#${next.id}"><span><small>القسم التالي</small><b>${next.title}</b></span>${ico('arrow')}</a>`;
}
function showSection(s) {
  const changed = state.section !== s;
  if (changed) {
    state.section = s; state.q = ''; state.cat = ''; state.sort = 'default';
    $('#searchInput').value = ''; $('#sortSelect').value = 'default';
    $('#categoryTitle').textContent = s.title;
    $('#categoryDescription').textContent = s.short;
    $('#categoryBadge').innerHTML = ico(s.id);
    renderSection(true); renderPager();
  }
  return changed;
}

/* ---------- Viewer ---------- */
const viewer = $('#viewer');
let openItem = null;
function mediaFrame(el, label = 'جارٍ التحميل…') {
  const wrap = document.createElement('div');
  wrap.className = 'media-frame';
  const load = document.createElement('div');
  load.className = 'media-loading'; load.textContent = label;
  const slow = setTimeout(() => { load.textContent = 'ما زال التحميل جاريًا…'; }, 8000);
  const done = () => { clearTimeout(slow); load.remove(); };
  wrap.append(el, load);
  return {wrap, done};
}
function showFileError(host, url, title) {
  const box = document.createElement('div');
  box.className = 'viewer-placeholder';
  box.innerHTML = `${ico('alert')}<p>تعذّر فتح «${esc(title)}» أو لم يُضف ملفها بعد.</p>${url ? `<a href="${esc(url)}" download>محاولة تنزيل الملف</a>` : ''}`;
  host.querySelector('.media-frame')?.remove();
  host.append(box);
}
function openResource(item, silent = false) {
  const s = byId(item.section), host = $('#viewerContent');
  openItem = item;
  host.replaceChildren();
  $('#viewerKind').textContent = s.title;
  const download = $('#viewerDownload');
  download.hidden = true;
  const h = document.createElement('h2'); h.id = 'viewerTitle'; h.textContent = item.title;
  host.append(h);
  const metaText = [item.category, item.audience].filter(Boolean).join(' · ');
  if (metaText) { const m = document.createElement('p'); m.className = 'viewer-meta'; m.textContent = metaText; host.append(m); }
  if (item.description) { const p = document.createElement('p'); p.textContent = item.description; host.append(p); }
  if (item.section === 'school' && item.steps?.length) {
    const ol = document.createElement('ol');
    item.steps.forEach(t => { const li = document.createElement('li'); li.textContent = t; ol.append(li); });
    host.append(ol);
  }
  const source = item.file || item.attachment;
  const ext = source ? source.split('?')[0].split('.').pop().toLowerCase() : '';
  if (item.section === 'play' && (item.embed || item.url)) {
    if (item.embed) {
      const f = document.createElement('iframe');
      f.title = item.title; f.allow = 'fullscreen; autoplay'; f.allowFullscreen = true; f.className = 'is-game';
      const {wrap, done} = mediaFrame(f, 'جارٍ تحميل اللعبة…');
      f.addEventListener('load', done); f.src = item.embed;
      host.append(wrap);
      const hint = document.createElement('p'); hint.className = 'viewer-hint';
      hint.innerHTML = `إذا لم تظهر اللعبة، <a href="${esc(item.url || item.embed)}" target="_blank" rel="noopener noreferrer">افتحها في نافذة جديدة</a>.`;
      host.append(hint);
    } else {
      const c = document.createElement('div'); c.className = 'file-card';
      c.innerHTML = `${ico('external')}<span>هذه اللعبة تُفتح في موقعها الخارجي. <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">فتح اللعبة في نافذة جديدة</a></span>`;
      host.append(c);
    }
    if (item.file) {
      const c = document.createElement('div'); c.className = 'file-card resource-download';
      c.innerHTML = `${ico('download')}<span>تفضّلين تشغيلها من PowerPoint؟ <a href="${esc(item.file)}" download>تنزيل ملف اللعبة</a></span>`;
      host.append(c);
    }
  } else if (item.url) {
    const c = document.createElement('div'); c.className = 'file-card';
    c.innerHTML = `${ico('external')}<span>مطوية تفاعلية على الويب. <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">فتح المطوية في نافذة جديدة</a></span>`;
    host.append(c);
  } else if (source) {
    download.href = item.file || source; download.hidden = false;
    if (item.pages?.length) {
      appendBookletPages(host, item.pages);
    } else if ((item.preview || source).split('?')[0].toLowerCase().endsWith('.pdf')) {
      const f = document.createElement('iframe'); f.title = `معاينة ${item.title}`;
      const {wrap, done} = mediaFrame(f, 'جارٍ تجهيز المعاينة…');
      f.addEventListener('load', done); f.src = `${item.preview || source}#view=FitH`; host.append(wrap);
      const hint = document.createElement('p'); hint.className = 'viewer-hint';
      hint.innerHTML = `<a href="${esc(item.preview || source)}" target="_blank" rel="noopener noreferrer">افتح PDF في تبويب جديد</a> أو استخدم زر التنزيل.`; host.append(hint);
    } else if (['png','jpg','jpeg','webp','gif','svg'].includes(ext)) {
      const im = document.createElement('img'); im.alt = item.title;
      const {wrap, done} = mediaFrame(im, 'جارٍ تحميل الصورة…');
      im.addEventListener('load', done); im.addEventListener('error', () => showFileError(host, source, item.title), {once: true});
      im.src = source; host.append(wrap);
    } else if (['mp4','webm','ogg'].includes(ext)) {
      const v = document.createElement('video'); v.controls = true; v.playsInline = true; v.preload = 'metadata';
      v.setAttribute('aria-label', item.title);
      if (item.cover) v.poster = item.cover;
      const {wrap, done} = mediaFrame(v, item.section === 'podcasts' ? 'جارٍ تحميل الحلقة…' : 'جارٍ تحميل الفيديو…');
      v.addEventListener('loadedmetadata', done, {once:true});
      v.addEventListener('loadeddata', done, {once:true});
      v.addEventListener('error', () => showFileError(host, source, item.title), {once: true});
      v.src = source; host.append(wrap);
    } else {
      const c = document.createElement('div'); c.className = 'file-card';
      c.innerHTML = `${ico('download')}<span>هذا الملف يُنزَّل إلى جهازك. <a href="${esc(source)}" download>تنزيل الملف</a></span>`;
      host.append(c);
    }
  } else if (item.section !== 'school' && item.section !== 'play') {
    showFileError(host, null, item.title);
  }
  if (item.downloads?.length) {
    const files = document.createElement('div'); files.className = 'additional-downloads';
    item.downloads.forEach(file => {
      const link = document.createElement('a'); link.className = 'chip-button'; link.href = file.file; link.download = ''; link.textContent = file.label; files.append(link);
    });
    host.append(files);
  }
  if (!viewed.has(item.id)) {
    viewed.add(item.id); store.set('omani-viewed', [...viewed]);
    refreshViewedUI();
  }
  if (!viewer.open) viewer.showModal();
  viewer.scrollTop = 0;
  if (!silent) history.replaceState(null, '', `#${item.section}/${encodeURIComponent(item.id)}`);
}
function appendBookletPages(host, pages) {
  const gallery = document.createElement('div'); gallery.className = 'booklet-pages';
  pages.forEach((page, index) => {
    const figure = document.createElement('figure'); figure.className = 'booklet-page';
    const caption = document.createElement('figcaption'); caption.textContent = page.label || `الصفحة ${num(index + 1)}`;
    const image = document.createElement('img'); image.src = page.src; image.alt = page.label || `الصفحة ${num(index + 1)}`; image.loading = index ? 'lazy' : 'eager'; image.decoding = 'async';
    if (page.width && page.height) { image.width = page.width; image.height = page.height; }
    image.addEventListener('error', () => {
      image.hidden = true; const error = document.createElement('p'); error.textContent = 'تعذّر تحميل هذه الصفحة. يمكنك تنزيل ملف PDF من الأعلى.'; figure.append(error);
    }, {once:true});
    const fullSize = document.createElement('a'); fullSize.href = page.src; fullSize.target = '_blank'; fullSize.rel = 'noopener noreferrer'; fullSize.setAttribute('aria-label', `${caption.textContent} — فتح بالحجم الكامل`); fullSize.title = 'افتح الصفحة بالحجم الكامل'; fullSize.append(image);
    figure.append(caption, fullSize); gallery.append(figure);
  });
  host.append(gallery);
}
function refreshViewedUI() {
  if (state.section) renderSection(false);
  renderRecent();
}
function closeViewer() {
  if (viewer.open) viewer.close();
}
viewer.addEventListener('close', () => {
  if (viewer.open) return; // a stale close event after the viewer was reopened
  $('#viewerContent').replaceChildren(); // stops video / iframes
  if (openItem) {
    const {page, rid} = parseHash();
    if (page === openItem.section && rid === openItem.id) history.replaceState(null, '', `#${openItem.section}`);
    openItem = null;
  }
});
viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
$('#viewerClose').addEventListener('click', closeViewer);
$('#copyLink').addEventListener('click', async () => {
  if (!openItem) return;
  const url = `${location.origin}${location.pathname}#${openItem.section}/${encodeURIComponent(openItem.id)}`;
  try {
    await navigator.clipboard.writeText(url);
    toast('تم نسخ رابط المادة');
  } catch {
    try {
      const ta = document.createElement('textarea'); ta.value = url; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove();
      ok ? toast('تم نسخ رابط المادة') : toast('تعذّر النسخ. انسخ الرابط من شريط العنوان.', 'error');
    } catch { toast('تعذّر النسخ. انسخ الرابط من شريط العنوان.', 'error'); }
  }
});

/* ---------- Search palette ---------- */
const palette = $('#palette'), pInput = $('#paletteInput'), pList = $('#paletteList');
let pItems = [], pIndex = 0;
function renderPalette() {
  const q = norm(pInput.value.trim());
  const secs = SECTIONS.filter(s => !q || norm(`${s.title} ${s.short} ${s.desc}`).includes(q));
  const res = q ? content.filter(x => haystack(x).includes(q)).slice(0, 8)
    : [...content].sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, 3);
  pItems = [
    ...secs.map(s => ({type: 'section', hash: s.id, icon: s.id, title: s.title, sub: s.short})),
    ...CRAFTS.filter(c=>!q||norm('ورشة الحرف كيف تصنع محاكاة تفاعلية '+c.title+' '+c.words).includes(q)).map(c=>({type:'feature',hash:c.hash,icon:'practice',title:'ورشة الحِرف: '+c.title,sub:c.description})),
    ...(window.OmaniJourney?.search(q) || []),
    ...res.map(x => ({type: 'item', hash: `${x.section}/${encodeURIComponent(x.id)}`, icon: x.section, title: x.title, sub: `${byId(x.section).title}${x.category ? ' · ' + x.category : ''}`}))
  ];
  pIndex = 0;
  if (!pItems.length) { pList.innerHTML = `<li class="palette-empty" role="presentation">لا توجد نتائج لـ «${esc(pInput.value.trim())}»</li>`; pInput.removeAttribute('aria-activedescendant'); return; }
  let html = '', last = '';
  pItems.forEach((it, i) => {
    const g = it.type === 'section' ? 'الأقسام' : it.type === 'feature' ? 'استكشف عُمان' : (q ? 'المواد' : 'أحدث المواد');
    if (g !== last) { html += `<li class="palette-group" role="presentation">${g}</li>`; last = g; }
    html += `<li class="palette-item" role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === 0}">${ico(it.icon)}<span><b>${esc(it.title)}</b><small>${esc(it.sub)}</small></span></li>`;
  });
  pList.innerHTML = html;
  pInput.setAttribute('aria-activedescendant', 'pal-0');
}
function movePalette(d) {
  if (!pItems.length) return;
  pIndex = (pIndex + d + pItems.length) % pItems.length;
  $$('.palette-item', pList).forEach((el, i) => el.setAttribute('aria-selected', String(i === pIndex)));
  const el = $(`#pal-${pIndex}`); pInput.setAttribute('aria-activedescendant', `pal-${pIndex}`); el.scrollIntoView({block: 'nearest'});
}
function chooseItem(i) {
  const it = pItems[i]; if (!it) return;
  palette.close();
  goTo('#' + it.hash);
}
function openPalette() {
  if (palette.open) return;
  closeMenu();
  pInput.value = ''; renderPalette(); palette.showModal(); pInput.focus();
}
pInput.addEventListener('input', renderPalette);
pInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); movePalette(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); movePalette(-1); }
  else if (e.key === 'Enter') { e.preventDefault(); chooseItem(pIndex); }
});
pList.addEventListener('click', e => { const li = e.target.closest('.palette-item'); if (li) chooseItem(+li.dataset.i); });
pList.addEventListener('mousemove', e => { const li = e.target.closest('.palette-item'); if (li && +li.dataset.i !== pIndex) movePalette(+li.dataset.i - pIndex); });
palette.addEventListener('click', e => { if (e.target === palette) palette.close(); });
$('#openSearch').addEventListener('click', openPalette);
$('#paletteClose').addEventListener('click', () => palette.close());
document.addEventListener('click', e => { if (e.target.closest('[data-open-search]')) openPalette(); });
document.addEventListener('keydown', e => {
  const typing = e.target.closest?.('input, textarea, select, [contenteditable]');
  if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey)) {
    e.preventDefault(); openPalette();
  }
});

/* ملفات المحاكاة وحدها تُحمّل عند زيارة الورشة؛ غلاف الدخول الصغير مستقل. */
const workshopLoading = new Map(),workshopAssets = new Map();
function loadWorkshop(craft='hub') {
  if (workshopLoading.has(craft)) return workshopLoading.get(craft);
  const version='20261028-four-crafts-r1';
  const load=(file,css=false)=>{
    if(workshopAssets.has(file))return workshopAssets.get(file);
    const promise=new Promise((resolve,reject)=>{
      const node=document.createElement(css?'link':'script');
      if(css){node.rel='stylesheet';node.href=file+'?v='+version;}else node.src=file+'?v='+version;
      node.onload=resolve;node.onerror=()=>{node.remove();workshopAssets.delete(file);reject(new Error('Failed to load '+file));};
      document.head.append(node);
    });workshopAssets.set(file,promise);return promise;
  };
  const pending=(async()=>{
    await load('workshop.css',true);
    if(craft==='hub')return;
    await load('workshop-shared.js');
    await load('workshop-simple.css',true);
    await load('workshop-simple-engine.js');
    await load('data/simple-crafts.js');
    await load('workshop-simple.js');
    for(const file of CRAFTS.find(c=>c.id===craft).files)await load(file);
  })().catch(error=>{workshopLoading.delete(craft);throw error;});
  workshopLoading.set(craft,pending);return pending;
}

/* ---------- Routing ---------- */
function parseHash() {
  let raw = 'home';
  try { raw = decodeURIComponent(location.hash.slice(1) || 'home'); } catch { /* malformed hash */ }
  const [page, ...rest] = raw.split('/');
  const rid = rest.join('/');
  if (page === 'calendar') {
    const chapter = window.OmaniJourney?.legacy(rid) || rid;
    history.replaceState(null,'','#journey'+(chapter ? '/'+chapter : ''));
    return {page:'journey',rid:chapter};
  }
  return {page, rid};
}
function goTo(hash) {
  if (location.hash === hash) route(); else location.hash = hash;
}
function closeMenu() {
  $('#primaryNav').classList.remove('is-open');
  $('#menuToggle').setAttribute('aria-expanded', 'false');
  $('#menuToggle').setAttribute('aria-label', 'فتح قائمة الأقسام');
}
let routedOnce = false;
function route() {
  const {page} = parseHash(), section = byId(page);
  const nextView = page === 'workshop' ? 'workshop' : page === 'journey' ? 'journey' : page === 'image-credits' ? 'credits' : section ? 'category' : 'home';
  const previousView = $('.page.is-active')?.dataset.page;
  const changed = nextView !== previousView || (section && state.section?.id !== section.id);
  const animate = routedOnce && changed && !['journey','workshop'].includes(nextView) && !['journey','workshop'].includes(previousView);
  routedOnce = true;
  const useSnapshot = animate && !reduceMotion() && document.startViewTransition && !document.documentElement.dataset.viewTransition;
  const update = () => {
    $$('.page').forEach(el=>el.classList.remove('is-route-entering'));
    renderRoute();
    const active = $('.page.is-active');
    if (animate && !useSnapshot && !reduceMotion() && active) {
      void active.offsetWidth; active.classList.add('is-route-entering');
    }
    if (nextView === 'home' && changed) {
      const target = ['about','collections','schoolGallery'].includes(page) ? document.querySelector(`#${page} h2`) : $('.hero-title');
      if (target) { target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }
    }
  };
  if (animate && window.OmaniMotion) window.OmaniMotion.run(update,'page'); else update();
}
function renderRoute() {
  const {page, rid} = parseHash();
  if (page === 'presentations' && rid === 'presentation-frankincense-tree-video') {
    history.replaceState(null, '', `#library/${rid}`); route(); return;
  }
  if (page === 'practice' && rid === 'video-omani-womens-dress-workshop') {
    history.replaceState(null, '', `#school/${rid}`); route(); return;
  }
  const section = byId(page);
  if (page !== 'journey') window.OmaniJourney?.leave();
  const selectedCraft=CRAFTS.find(c=>c.id===rid),craft=selectedCraft?.id||'hub';
  for(const c of CRAFTS)if(page!=='workshop'||craft!==c.id)window[c.api]?.leave();
  if (page === 'workshop') {
    closeViewer(); closeMenu(); state.section = null;
    $$('[data-page]').forEach(x=>x.classList.toggle('is-active',x.dataset.page==='workshop'));
    $$('.primary-nav a').forEach(a=>a.removeAttribute('aria-current'));
    $('#siteHeader').dataset.view='workshop';
    const heading=selectedCraft?.heading||'workshopHubTitle';
    $('#page-workshop').setAttribute('aria-labelledby',heading);
    $('#workshopHub').hidden=craft!=='hub';for(const c of CRAFTS)$('#'+c.root).hidden=craft!==c.id;
    $('#workshopBack').hidden=craft==='hub';
    document.title=(selectedCraft?.title||'ورشة الحِرف')+' | الموسوعة العُمانية';
    scrollTo({top:0,behavior:'auto'});
    loadWorkshop(craft).then(()=>{
      const current=parseHash();if(current.page!=='workshop'||current.rid!==rid)return;
      if(selectedCraft)window[selectedCraft.api].enter();else $('#workshopHubTitle').focus({preventScroll:true});
    }).catch(()=>{
      const host=selectedCraft?$('#'+selectedCraft.root):$('#workshopHub');
      host.innerHTML='<div class="ws-loading"><h1 tabindex="-1">تعذّر تجهيز الورشة</h1><p>تحقق من الاتصال، ثم أعد المحاولة.</p><button class="button button-primary" type="button" id="workshopRetry">أعد المحاولة</button></div>';
      $('#workshopRetry').onclick=()=>route();
    });
    return;
  }
  if (page === 'journey') {
    closeViewer(); closeMenu(); state.section = null;
    $$('[data-page]').forEach(x=>x.classList.toggle('is-active',x.dataset.page==='journey'));
    $$('.primary-nav a').forEach(a=>a.removeAttribute('aria-current'));
    $('#siteHeader').dataset.view='journey';
    document.title='رحلة عام في عُمان | الموسوعة العُمانية';
    window.OmaniJourney?.enter(rid);
    return;
  }
  if (page === 'image-credits') {
    closeViewer(); closeMenu(); state.section = null;
    $$('[data-page]').forEach(x => x.classList.toggle('is-active', x.dataset.page === 'credits'));
    $$('.primary-nav a').forEach(a => a.removeAttribute('aria-current'));
    $('#siteHeader').dataset.view = 'credits';
    window.OmaniJourney?.renderCredits();
    document.title = 'مصادر الصور | الموسوعة العُمانية';
    scrollTo({top:0,behavior:reduceMotion()?'auto':'smooth'});
    $('#imageCreditsTitle').focus({preventScroll:true});
    return;
  }
  const homeAnchors = ['home', 'schoolGallery', 'about', 'collections'];
  const isHome = !section;
  $('#siteHeader').dataset.view = isHome ? 'home' : 'category';
  if ((!rid || !section) && viewer.open) viewer.close();
  $$('[data-page]').forEach(x => x.classList.toggle('is-active', x.dataset.page === (isHome ? 'home' : 'category')));
  $$('.primary-nav a').forEach(a => {
    const cur = a.dataset.route === (section ? section.id : 'home');
    if (cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  closeMenu();
  if (section) {
    const changed = showSection(section);
    document.title = `${section.title} | الموسوعة العُمانية`;
    if (changed) {
      scrollTo({top: 0, behavior: reduceMotion() ? 'auto' : 'smooth'});
      $('#categoryTitle').focus({preventScroll: true});
    }
    if (rid) {
      const item = content.find(x => x.id === rid && x.section === section.id);
      if (item) openResource(item, true);
      else { toast('تعذّر العثور على المادة المطلوبة', 'error'); history.replaceState(null, '', `#${section.id}`); }
    }
  } else {
    state.section = null;
    document.title = TITLE;
    const anchor = homeAnchors.includes(page) && page !== 'home' ? document.getElementById(page) : null;
    if (anchor) {
      anchor.scrollIntoView({behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start'});
      const heading = anchor.querySelector('h2');
      if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
    } else scrollTo({top: 0, behavior: reduceMotion() ? 'auto' : 'smooth'});
  }
}

/* ---------- Intro (stays until the visitor enters) ---------- */
function prepareSplashMedia() {
  const deepLink = location.hash.length > 1 && location.hash !== '#home';
  if (deepLink || !document.documentElement.classList.contains('splash-on')) return;
  const image = $('.splash-landscape');
  if (!image || image.getAttribute('src')) return;
  image.fetchPriority = 'high';
  image.srcset = image.dataset.srcset;
  image.src = image.dataset.src;
}
function intro() {
  const splash = $('#splash'), root = document.documentElement, reduce = reduceMotion();
  let seen = false;
  try { seen = !!sessionStorage.getItem('omani-intro-seen-v2') && !/[?&]intro\b/.test(location.search); } catch { /* storage blocked */ }
  const deepLink = location.hash.length > 1 && location.hash !== '#home';
  if (seen || deepLink) { splash.classList.add('is-hidden'); root.classList.remove('splash-on'); return; }
  root.classList.add('splash-on');
  const under = $$('.site-header, main, .site-footer, .skip-link');
  under.forEach(el => { el.inert = true; });
  $('#enterSite').focus({preventScroll: true});
  let leaving = false;
  const leave = () => {
    if (leaving) return; leaving = true;
    try { sessionStorage.setItem('omani-intro-seen-v2', '1'); } catch { /* ignore */ }
    splash.style.removeProperty('--dy'); splash.classList.remove('is-dragging'); splash.classList.add('is-leaving');
    under.forEach(el => { el.inert = false; });
    setTimeout(() => { splash.classList.add('is-hidden'); root.classList.remove('splash-on'); scrollTo(0, 0); $('.hero-title').setAttribute('tabindex', '-1'); $('.hero-title').focus({preventScroll:true}); }, reduce ? 0 : 860);
  };
  $('#enterSite').addEventListener('click', leave);
  splash.addEventListener('wheel', e => { if (e.deltaY > 12) { e.preventDefault(); leave(); } }, {passive: false});
  let y0 = null, dy = 0, ts = 0;
  splash.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; ts = e.timeStamp; splash.setPointerCapture(e.pointerId); splash.classList.add('is-dragging'); });
  splash.addEventListener('pointermove', e => { if (y0 === null) return; dy = Math.max(0, y0 - e.clientY); splash.style.setProperty('--dy', -Math.min(dy, innerHeight * .6) + 'px'); });
  const end = e => { if (y0 === null) return; const v = dy / Math.max(1, e.timeStamp - ts); y0 = null; splash.classList.remove('is-dragging'); if (dy > 90 || (dy > 30 && v > .5)) leave(); else splash.style.removeProperty('--dy'); };
  splash.addEventListener('pointerup', end); splash.addEventListener('pointercancel', end);
}

/* ---------- Scroll effects ---------- */
function initScroll() {
  const header = $('#siteHeader'), bar = $('#scrollProgress'), top = $('#toTop');
  let ticking = false;
  const update = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    top.hidden = y < 700;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
  top.addEventListener('click', () => scrollTo({top: 0, behavior: reduceMotion() ? 'auto' : 'smooth'}));
  update();
}
function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion()) { els.forEach(e => e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), {threshold: .12});
  els.forEach(e => io.observe(e));
}
function initSchoolGallery() {
  const gallery = $('#schoolGallery'), viewport = $('#galleryViewport'), track = $('#galleryTrack');
  const pause = $('#galleryPause'), previous = $('#galleryPrev'), next = $('#galleryNext');
  const cards = track ? $$('.gallery-photo', track) : [];
  const dialog = $('#galleryLightbox'), dialogImage = $('#galleryLightboxImage'), dialogCaption = $('#galleryLightboxCaption');
  const dialogClose = $('#galleryLightboxClose'), dialogPrev = $('#galleryLightboxPrev'), dialogNext = $('#galleryLightboxNext');
  if (!gallery || !viewport || !track || !cards.length) return;
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motionPreference.matches;
  let raf = 0, lastTime = 0, direction = 1, inView = !('IntersectionObserver' in window);
  let userPaused = reduced, focusPaused = false, hovering = false, holdUntil = 0, selected = 0, opener = null;
  const speed = 20;
  let position = viewport.scrollLeft, autoScrolling = false;
  const maxScroll = () => Math.max(0, viewport.scrollWidth - viewport.clientWidth);
  const updateControls = () => {
    if (previous) previous.disabled = viewport.scrollLeft <= 1;
    if (next) next.disabled = viewport.scrollLeft >= maxScroll() - 1;
  };
  const shouldPause = () => reduced || userPaused || focusPaused || hovering || !inView || document.hidden || Boolean(dialog?.open);
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; gallery.setAttribute('data-motion', 'paused'); };
  const tick = now => {
    raf = 0;
    if (shouldPause()) return;
    const dt = lastTime ? Math.min(48, now - lastTime) : 0;
    lastTime = now;
    const max = maxScroll();
    if (max > 0 && now >= holdUntil) {
      position += direction * speed * dt / 1000;
      if (position >= max) { position = max; direction = -1; holdUntil = now + 650; }
      else if (position <= 0) { position = 0; direction = 1; holdUntil = now + 650; }
      autoScrolling = true;
      viewport.scrollLeft = position;
      autoScrolling = false;
      updateControls();
    }
    raf = requestAnimationFrame(tick);
  };
  const syncMotion = () => {
    const paused = shouldPause();
    gallery.setAttribute('data-motion', paused ? 'paused' : 'running');
    if (paused) stop();
    else if (!raf) { position = viewport.scrollLeft; raf = requestAnimationFrame(tick); }
  };
  const pauseForInteraction = (duration = 1200) => {
    stop();
    holdUntil = performance.now() + duration;
    setTimeout(syncMotion, duration + 30);
  };
  const nudge = (directionStep, e) => {
    if (e?.detail > 0) focusPaused = false;
    const distance = Math.max(220, Math.round(viewport.clientWidth * .68)) * directionStep;
    pauseForInteraction(950);
    viewport.scrollBy({left: distance, behavior: reduced ? 'auto' : 'smooth'});
  };
  previous?.addEventListener('click', e => nudge(-1, e));
  next?.addEventListener('click', e => nudge(1, e));
  viewport.addEventListener('scroll', () => { if (!raf && !autoScrolling) position = viewport.scrollLeft; updateControls(); }, {passive:true});
  pause?.addEventListener('click', e => {
    userPaused = !userPaused;
    if (e.detail > 0) focusPaused = false;
    pause.setAttribute('aria-pressed', String(userPaused));
    pause.setAttribute('aria-label', userPaused ? 'استأنف حركة الصور' : 'أوقف حركة الصور');
    pause.querySelector('span').textContent = userPaused ? 'تشغيل العرض' : 'إيقاف العرض';
    pause.querySelector('svg').innerHTML = userPaused
      ? '<path d="m9 5 10 7-10 7z" fill="currentColor"/>'
      : '<path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
    syncMotion();
  });
  gallery.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; syncMotion(); } });
  gallery.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovering = false; syncMotion(); } });
  gallery.addEventListener('focusin', () => { focusPaused = true; syncMotion(); });
  gallery.addEventListener('focusout', () => setTimeout(() => { focusPaused = gallery.contains(document.activeElement); syncMotion(); }, 0));
  viewport.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { focusPaused = false; pauseForInteraction(1500); } }, {passive:true});
  viewport.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') setTimeout(() => { focusPaused = false; syncMotion(); }, 1500); }, {passive:true});
  viewport.addEventListener('wheel', () => pauseForInteraction(1400), {passive:true});
  viewport.addEventListener('keydown', e => {
    if (e.target !== viewport || !['ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault(); nudge(e.key === 'ArrowLeft' ? -1 : 1, e);
  });
  motionPreference.addEventListener('change', e => { reduced = e.matches; userPaused = reduced; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncMotion(); }, {threshold:.12});
    observer.observe(gallery);
  }
  cards.forEach((card, i) => card.addEventListener('click', () => {
    if (!dialog || !dialogImage || !dialogCaption || typeof dialog.showModal !== 'function') return;
    selected = i; opener = card;
    const image = $('img', card);
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = card.dataset.caption || image.alt;
    dialog.showModal();
    dialogClose?.focus();
    syncMotion();
  }));
  const updateDialog = step => {
    selected = (selected + step + cards.length) % cards.length;
    const image = $('img', cards[selected]);
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = cards[selected].dataset.caption || image.alt;
  };
  dialogPrev?.addEventListener('click', () => updateDialog(-1));
  dialogNext?.addEventListener('click', () => updateDialog(1));
  dialogClose?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog?.addEventListener('close', () => {
    const restore = opener;
    opener = null;
    restore?.focus({preventScroll:true});
    requestAnimationFrame(() => { focusPaused = false; syncMotion(); });
  });
  updateControls();
  syncMotion();
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  if (!dataOk) $('#dataError').hidden = false;
  renderBays(); renderRecent(); bindImageReveal(document); initStepper();
  window.OmaniJourney?.init();
  prepareSplashMedia(); intro(); initScroll(); initReveal(); initSchoolGallery();
  route();
  addEventListener('hashchange', route);

  // menu
  const toggle = $('#menuToggle'), nav = $('#primaryNav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق قائمة الأقسام' : 'فتح قائمة الأقسام');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (nav.classList.contains('is-open') && !e.target.closest('#primaryNav, #menuToggle')) closeMenu(); });

  // resources (event delegation for both grids)
  const open = e => {
    const b = e.target.closest('[data-resource]');
    if (b) { const item = content.find(x => x.id === b.dataset.resource); if (item) openResource(item); }
  };
  $('#categoryGrid').addEventListener('click', e => {
    const link = e.target.closest('[data-external-resource]');
    if (link) {
      viewed.add(link.dataset.externalResource); store.set('omani-viewed', [...viewed]);
      setTimeout(refreshViewedUI, 0);
    }
    open(e);
  });
  $('#recentGrid').addEventListener('click', open);
  [$('#categoryGrid'), $('#recentGrid')].forEach(grid => grid.addEventListener('error', e => {
    if (e.target.matches('.resource-cover-image')) {
      const ph = document.createElement('div');
      ph.className = 'resource-cover'; ph.setAttribute('aria-hidden', 'true');
      ph.innerHTML = ico(e.target.closest('.resource-card')?.dataset.section || 'library');
      e.target.replaceWith(ph);
    }
  }, true));

  // toolbar
  $('#searchInput').addEventListener('input', e => { state.q = e.target.value; renderSection(false); });
  $('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderSection(true); });
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat; renderSection(true);
  });
  $('#emptyState').addEventListener('click', e => {
    if (e.target.closest('[data-clear]')) { state.q = ''; state.cat = ''; $('#searchInput').value = ''; renderSection(true); }
    if (e.target.closest('[data-reload]')) location.reload();
  });
  $('#resetProgress').addEventListener('click', () => {
    const ids = new Set(inSection(state.section.id).map(x => x.id));
    ids.forEach(id => viewed.delete(id));
    store.set('omani-viewed', [...viewed]);
    refreshViewedUI();
    toast('تم مسح سجل الاطّلاع لهذا القسم');
  });
  $('#retryData').addEventListener('click', () => location.reload());
});
})();
