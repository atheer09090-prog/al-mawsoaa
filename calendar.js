(() => {
'use strict';
const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const seasons = ['الشتاء','الربيع','القيظ','خريف ظفار','الاعتدال'];
const all = Array.isArray(window.OMANI_CALENDAR) ? window.OMANI_CALENDAR : [];
const entries = all.filter(e => e && Number.isInteger(e.month) && e.month >= 1 && e.month <= 12);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold = s => String(s ?? '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const digits = new Intl.NumberFormat('ar-OM-u-nu-arab',{minimumIntegerDigits:2,useGrouping:false});
const $ = s => document.querySelector(s);
const currentMonth = new Date().getMonth() + 1;
let selectedMonth = currentMonth, selectedEvent = 0, ready = false, mediaReady = false, mediaToken = 0, displayedImage = '';
const warmed = new Set();
const monthEntries = month => entries.filter(e => e.month === month);
const chosen = () => monthEntries(selectedMonth)[selectedEvent];
const sizes = '(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 58vw, 700px';

function calendarTabIndex(index,key,count) {
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  const direction = {ArrowLeft:1,ArrowRight:-1}[key];
  return direction ? (index + direction + count) % count : null;
}

// One transition owner prevents overlapping page and calendar snapshots.
function runTransition(update,kind = 'calendar') {
  const root = document.documentElement;
  if (reduced() || !document.startViewTransition || root.dataset.viewTransition) { update(); return; }
  root.dataset.viewTransition = kind;
  try {
    const transition = document.startViewTransition(update);
    transition.finished.catch(() => {}).finally(() => { delete root.dataset.viewTransition; });
  } catch { delete root.dataset.viewTransition; update(); }
}
window.OmaniMotion = {run:runTransition};

function resourceLink(link) {
  return (window.OMANI_CONTENT || []).some(item => link === `#${item.section}/${encodeURIComponent(item.id)}`) ? link : null;
}
function imageCredit(credit) {
  return `<span>تصوير: <bdi>${esc(credit.author)}</bdi></span><span>·</span><a href="${esc(credit.url)}" target="_blank" rel="noopener noreferrer">مصدر الصورة</a><span>·</span><a href="${esc(credit.licenseUrl)}" target="_blank" rel="noopener noreferrer"><bdi>${esc(credit.license)}</bdi></a>`;
}
function updateMarker() {
  const button = $(`#calendar-month-${selectedMonth}`), marker = $('#calendarMonthMarker');
  if (!button || !marker) return;
  marker.style.setProperty('--marker-width',button.offsetWidth+'px');
  marker.style.transform = `translateX(${button.offsetLeft}px)`;
}
function keepTabVisible(button) {
  const bar = $('#calendarMonths'), rect = button.getBoundingClientRect(), view = bar.getBoundingClientRect();
  const distance = rect.left < view.left ? rect.left-view.left-8 : rect.right > view.right ? rect.right-view.right+8 : 0;
  if (distance) bar.scrollBy({left:distance,behavior:reduced()?'auto':'smooth'});
}
function updateImage(entry) {
  if (!mediaReady || !entry) return;
  const token = ++mediaToken, frame = $('#calendarImageFrame');
  frame.querySelectorAll('img:not(.is-active)').forEach(image => image.remove());
  if (displayedImage === entry.image.src) return;
  const image = new Image();
  image.className = 'calendar-image'; image.alt = entry.image.alt;
  image.width = 1800; image.height = 1013; image.loading = 'lazy'; image.decoding = 'async';
  image.style.objectPosition = entry.image.focal || '50% 50%';
  image.addEventListener('load',() => {
    if (token !== mediaToken) { image.remove(); return; }
    const previous = frame.querySelector('img.is-active');
    displayedImage = entry.image.src;
    frame.dataset.loaded = 'true'; frame.removeAttribute('data-failed');
    $('#calendarImageCredit').innerHTML = imageCredit(entry.image.credit);
    requestAnimationFrame(() => {
      if (token !== mediaToken) return;
      image.classList.add('is-active'); previous?.classList.remove('is-active');
      setTimeout(() => { if (!previous?.classList.contains('is-active')) previous?.remove(); },reduced()?0:700);
    });
  },{once:true});
  image.addEventListener('error',() => {
    image.remove(); if (token !== mediaToken) return;
    frame.querySelectorAll('img').forEach(img => img.remove()); displayedImage = '';
    frame.dataset.failed = 'true'; frame.removeAttribute('data-loaded');
    $('#calendarImageMessage').textContent = 'تعذّر تحميل الصورة. يمكنك متابعة قراءة الحكاية.';
    $('#calendarImageCredit').replaceChildren();
  },{once:true});
  image.sizes = sizes; image.srcset = entry.image.srcset; image.src = entry.image.src;
  frame.append(image);
}
function warmImage(month) {
  // Only an adjacent month indicated by the reader is fetched ahead of time.
  const gap = (month-selectedMonth+12)%12;
  if (!mediaReady || ![1,11].includes(gap) || navigator.connection?.saveData || /(^|-)2g/.test(navigator.connection?.effectiveType || '')) return;
  const entry = monthEntries(month)[0];
  if (!entry || warmed.has(entry.image.src)) return;
  warmed.add(entry.image.src); const image = new Image();
  image.sizes = sizes; image.srcset = entry.image.srcset; image.src = entry.image.src;
}
function renderStory(announce = false) {
  const entry = chosen(); if (!entry) return;
  const panel = $('#calendarStory'), matchingLink = resourceLink(entry.encyclopediaLink);
  panel.setAttribute('aria-labelledby',`calendar-event-${entry.id}`);
  panel.innerHTML = `<div class="calendar-types">${entry.types.map(type=>`<span>${esc(type)}</span>`).join('')}</div>
    <h3>${esc(entry.title)}</h3><p class="calendar-place">${esc(entry.place)}</p>
    <p class="calendar-summary">${esc(entry.summary)}</p>
    ${entry.didYouKnow ? `<aside class="calendar-fact"><b>هل تعلم؟</b><p>${esc(entry.didYouKnow)}</p></aside>` : ''}
    ${entry.verified === false ? '<p class="calendar-unverified">هذه المعلومة تحتاج إلى تأكيد.</p>' : ''}
    <div class="calendar-story-links">${matchingLink ? `<a class="text-link" href="${esc(matchingLink)}">اقرأ في الموسوعة <svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>` : ''}
    <details class="calendar-source"><summary>مصدر المعلومة</summary><p>${esc(entry.sourceNote)}</p>${(entry.sources || []).map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a>`).join('')}</details></div>`;
  panel.classList.remove('is-changing');
  if (announce && !reduced()) { void panel.offsetWidth; panel.classList.add('is-changing'); }
  $('#calendarMonthLabel').textContent = `${months[selectedMonth-1]} · ${entry.season}`;
  $('#calendarCounter').innerHTML = `<bdi dir="ltr">${digits.format(selectedMonth)}</bdi><span aria-hidden="true">/</span><bdi dir="ltr">${digits.format(12)}</bdi>`;
  $('#calendarCounter').setAttribute('aria-label',`الشهر ${months[selectedMonth-1]} من اثني عشر شهرًا`);
  $('#calendarPanel').setAttribute('aria-labelledby',`calendar-month-${selectedMonth}`);
  $('#calendarSeasons').querySelectorAll('[data-season]').forEach(el=>el.classList.toggle('is-active',el.dataset.season===entry.season));
  if (announce) $('#calendarStatus').textContent = `${months[selectedMonth-1]}: ${entry.title}`;
  updateImage(entry);
}
function renderEvents() {
  const items = monthEntries(selectedMonth), bar = $('#calendarEvents');
  bar.hidden = items.length === 1;
  bar.innerHTML = items.map((entry,i)=>`<button type="button" role="tab" id="calendar-event-${esc(entry.id)}" aria-controls="calendarStory" aria-selected="${i===selectedEvent}" tabindex="${i===selectedEvent?0:-1}" data-event="${i}">${esc(entry.title)}</button>`).join('');
}
function selectMonth(month,focus = false,announce = true,eventIndex = 0) {
  if (!ready || !monthEntries(month).length) return;
  selectedMonth = month; selectedEvent = eventIndex;
  $('#calendarMonths').querySelectorAll('[role="tab"]').forEach(button => {
    const active = Number(button.dataset.month)===month;
    button.setAttribute('aria-selected',String(active)); button.tabIndex=active?0:-1;
  });
  renderEvents(); updateMarker();
  if (announce) runTransition(()=>renderStory(true)); else renderStory();
  const tab = $(`#calendar-month-${month}`);
  if (focus) tab.focus({preventScroll:true});
  keepTabVisible(tab);
}
function init() {
  const section = $('#calendar');
  if (!section || !entries.length) { if(section) section.hidden=true; return; }
  const bar = $('#calendarMonths');
  bar.innerHTML = `<div class="calendar-month-track"><span class="calendar-month-marker" id="calendarMonthMarker" aria-hidden="true"></span>${months.map((name,i)=>`<button class="calendar-month" id="calendar-month-${i+1}" type="button" role="tab" aria-controls="calendarPanel" aria-selected="false" tabindex="-1" data-month="${i+1}"><span class="calendar-month-number" aria-hidden="true">${digits.format(i+1)}</span><span>${name}</span><span class="calendar-current">${i+1===currentMonth?'هذا الشهر':''}</span></button>`).join('')}</div>`;
  $('#calendarSeasons').innerHTML = seasons.map(season=>`<span data-season="${season}">${season}</span>`).join('');
  bar.addEventListener('click',event=>{const button=event.target.closest('[data-month]');if(button)selectMonth(Number(button.dataset.month));});
  bar.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-month]');if(!button)return;
    const next=calendarTabIndex(Number(button.dataset.month)-1,event.key,12);
    if(next!==null){event.preventDefault();selectMonth(next+1,true);}
  });
  bar.addEventListener('pointerover',event=>{const button=event.target.closest('[data-month]');if(button)warmImage(Number(button.dataset.month));});
  $('#calendarEvents').addEventListener('click',event=>{
    const button=event.target.closest('[data-event]');if(!button)return;
    selectedEvent=Number(button.dataset.event);renderEvents();runTransition(()=>renderStory(true));
    $(`#calendar-event-${chosen().id}`)?.focus({preventScroll:true});
  });
  $('#calendarEvents').addEventListener('keydown',event=>{
    const button=event.target.closest('[data-event]');if(!button)return;
    const next=calendarTabIndex(selectedEvent,event.key,monthEntries(selectedMonth).length);
    if(next!==null){event.preventDefault();selectedEvent=next;renderEvents();runTransition(()=>renderStory(true));$(`#calendar-event-${chosen().id}`)?.focus({preventScroll:true});}
  });
  ready=true;selectMonth(currentMonth,false,false);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(items=>{if(items.some(item=>item.isIntersecting)){mediaReady=true;updateImage(chosen());observer.disconnect();}},{rootMargin:'200px'});
    observer.observe(section);
  }else{mediaReady=true;updateImage(chosen());}
  if('ResizeObserver' in window)new ResizeObserver(updateMarker).observe(bar);
  document.fonts?.ready.then(updateMarker);
}
function selectEvent(id) {
  const entry=entries.find(e=>e.id===id);if(!entry)return false;
  selectMonth(entry.month,false,true,monthEntries(entry.month).indexOf(entry));return true;
}
function search(query) {
  const q=fold(query);
  const feature={type:'feature',hash:'calendar',icon:'calendar',title:'عُمان على مدار العام',sub:'تقويم المواسم والطبيعة والتراث في عُمان'};
  const result=!q||fold(feature.title+' '+feature.sub+' الأشهر').includes(q)?[feature]:[];
  if(q)result.push(...entries.filter(e=>fold(`${e.title} ${e.place} ${e.summary} ${months[e.month-1]}`).includes(q)).slice(0,5).map(e=>({type:'feature',hash:'calendar/'+e.id,icon:'calendar',title:e.title,sub:`تقويم عُمان · ${months[e.month-1]}`})));
  if(!q||fold('مصادر الصور المصور الرخصة تراخيص').includes(q))result.push({type:'feature',hash:'image-credits',icon:'image',title:'مصادر الصور',sub:'مصورو صور التقويم وتراخيص إعادة استخدامها'});
  return result;
}
function renderCredits() {
  const grid=$('#imageCreditsGrid');if(!grid||grid.childElementCount)return;
  const unique=[...new Map(entries.map(e=>[e.image.src,e.image])).values()];
  grid.innerHTML=unique.map(image=>`<figure class="image-credit-card"><img src="${esc(image.src.replace('-1200.webp','-640.webp'))}" width="640" height="360" alt="${esc(image.alt)}" loading="lazy" decoding="async"><figcaption><h2>${esc(image.alt)}</h2><div class="source-credit">${imageCredit(image.credit)}</div><p>${esc(image.credit.changes)}</p></figcaption></figure>`).join('');
}
window.OmaniCalendar={init,selectEvent,search,renderCredits};
})();
