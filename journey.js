/* A year told by scrolling. All facts and photo credits come from data/journey.js. */
(() => {
'use strict';
const entries = window.OMANI_JOURNEY || [];
const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const aliases = {'rose-water':'rose-picking','khareef-arrives':'darbat-green','pomegranate-start':'pomegranate-harvest','khareef-landscape':'darbat-green','khareef-finale':'darbat-green'};
const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fold = value => String(value ?? '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
const digits = new Intl.NumberFormat('ar-OM-u-nu-arab',{minimumIntegerDigits:2,useGrouping:false});
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const shortViewport = matchMedia('(max-height: 520px)');
const currentMonth = new Date().getMonth()+1;
const current = () => entries.find(e=>e.month===currentMonth) || entries[0];
let active = false, initialized = false, selected = -1, serial = 0, frame = 0, manualLinear = false, observer, sourceOpener;
const linear = () => preference.matches || shortViewport.matches || manualLinear || !('IntersectionObserver' in window);
const nativeScroll = () => Boolean(window.CSS?.supports('animation-timeline: view()') && window.CSS?.supports('timeline-scope: --year'));
const sourceLabel = source => source.kind === 'encyclopedia' ? 'من الموسوعة العُمانية' : 'مصدر مساند';
const resourceLink = link => (window.OMANI_CONTENT || []).some(item=>link === '#'+item.section+'/'+encodeURIComponent(item.id)) ? link : null;
function chapterIndex(index,key,count) {
  if (key === 'Home') return 0;
  if (key === 'End') return count-1;
  const delta = {ArrowLeft:1,ArrowRight:-1,ArrowDown:1,ArrowUp:-1,PageDown:1,PageUp:-1}[key];
  return delta ? Math.min(count-1,Math.max(0,index+delta)) : null;
}
function photoMarkup(photo,kind,index) {
  return '<img class="journey-photo journey-'+(kind==='detail'?'detail-image':kind)+'" data-src="'+esc(photo.src)+'" data-srcset="'+esc(photo.srcset)+'" sizes="'+(kind==='wide'?'100vw':'(max-width: 760px) 90px, 170px')+'" width="'+photo.width+'" height="'+photo.height+'" loading="lazy" decoding="async" alt="'+esc(photo.alt)+'" style="object-position:'+esc(photo.focal)+';--chapter-timeline:--month-'+index+'">';
}
function photoCredit(photo,detail = false) {
  const c=photo.credit;
  return '<span>'+(detail?'':'تصوير: ')+'<bdi>'+esc(c.author)+'</bdi></span> · <a href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">'+esc(c.license)+'</a>';
}
function sourceBody(entry) {
  const source=entry.source;
  return '<span class="journey-source-kind">'+sourceLabel(source)+'</span><h3>'+esc(source.entryTitle || 'مرجع موثق')+'</h3><dl><div><dt>مجلد الموسوعة</dt><dd>'+esc(source.volume ?? 'غير متاح')+'</dd></div><div><dt>صفحة الموسوعة</dt><dd>'+esc(source.page ?? 'غير متاحة')+'</dd></div></dl><p>'+esc(source.note)+'</p>'+(source.url?'<a class="text-link" href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">افتح المرجع الأصلي ↗</a>':'')+(source.references || []).map(ref=>'<a class="text-link journey-extra-source" href="'+esc(ref.url)+'" target="_blank" rel="noopener noreferrer">'+esc(ref.entryTitle)+' ↗</a>').join('');
}
function renderChapter(entry,index) {
  const link=resourceLink(entry.encyclopediaLink);
  return '<article class="journey-scene" id="journey-chapter-'+esc(entry.id)+'" role="region" aria-label="'+months[entry.month-1]+' — '+esc(entry.title)+'" aria-hidden="true" inert data-index="'+index+'" data-season="'+esc(entry.season)+'"><figure class="journey-landscape">'+photoMarkup(entry.image,'wide',index)+'<figcaption class="source-credit journey-photo-credit">'+photoCredit(entry.image)+'</figcaption></figure><span class="journey-number" aria-hidden="true">'+digits.format(entry.month)+'</span><figure class="journey-detail">'+photoMarkup(entry.detail,'detail',index)+'<figcaption class="source-credit">'+photoCredit(entry.detail,true)+'</figcaption></figure><div class="journey-copy"><p class="journey-month">'+months[entry.month-1]+' <span>· '+esc(entry.season)+'</span></p><h2 id="journey-title-'+esc(entry.id)+'" tabindex="-1">'+esc(entry.title)+'</h2><p class="journey-place">'+esc(entry.place)+'</p><p class="journey-narrative">'+entry.narrative.map((line,i)=>'<span style="--line:'+i+'">'+esc(line)+'</span>').join('')+'</p><aside class="journey-fact"><span class="journey-fact-label">حقيقة <span>'+sourceLabel(entry.source)+'</span></span><p>'+esc(entry.fact)+'</p><div class="journey-fact-actions"><button type="button" data-journey-source="'+index+'" aria-haspopup="dialog" aria-label="مصدر حقيقة '+months[entry.month-1]+'">المصدر ↗</button>'+(link?'<a href="'+esc(link)+'">اقرأ في الموسوعة ←</a>':'')+'</div></aside></div></article>';
}
function loadImage(image) {
  if (!image || image.getAttribute('src')) return;
  image.addEventListener('error',()=>image.closest('figure')?.classList.add('image-unavailable'),{once:true});
  image.srcset=image.dataset.srcset;image.src=image.dataset.src;
}
function loadChapter(index) {
  if (!entries[index]) return;
  $$('.journey-scene[data-index="'+index+'"] img').forEach(loadImage);
}
function updateRail(index) {
  const rail=$('#journeyRail');
  rail.querySelectorAll('a').forEach((link,i)=>{
    if(i===index) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current');
  });
  $('#journeyReadingLabel').textContent=months[entries[index].month-1]+' · '+digits.format(entries[index].month)+' / ١٢';
}
function select(index,announce=true) {
  if (!active || !entries[index]) return;
  loadChapter(index);loadChapter(index+1);
  if(selected===index)return;
  selected=index;
  const token=++serial;
  $$('.journey-scene').forEach((scene,i)=>{
    const on=i===index;
    const was=scene.classList.contains('is-active');
    scene.classList.toggle('is-leaving',was&&!on&&!linear());
    scene.classList.toggle('is-active',on);
    scene.inert=!linear()&&!on;
    scene.setAttribute('aria-hidden',String(!linear()&&!on));
  });
  updateRail(index);
  $('#journeyTrack').dataset.season=entries[index].season;
  if(announce)$('#journeyStatus').textContent=months[entries[index].month-1]+': '+entries[index].title;
  setTimeout(()=>{if(token===serial)$$('.journey-scene.is-leaving').forEach(el=>el.classList.remove('is-leaving'));},700);
}
function measure() {
  frame=0;if(!active||linear())return;
  const track=$('#journeyTrack'),stage=$('#journeyStage'),rect=track.getBoundingClientRect(),height=stage.clientHeight;
  const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
  track.style.setProperty('--year-progress',progress);
  const reading=rect.top<height*.55&&rect.bottom>height*.45;
  track.classList.toggle('is-reading',reading);
  if(!nativeScroll()&&selected>=0){
    const step=$('#journey-step-'+entries[selected].id).getBoundingClientRect();
    const p=Math.max(0,Math.min(1,(height*.5-step.top)/step.height));
    $$('.journey-scene.is-active .journey-wide').forEach(image=>image.style.setProperty('--drift',(p*6-3)+'%'));
  }
}
function queueMeasure(){if(!frame)frame=requestAnimationFrame(measure);}
function setMode() {
  const on=linear(),page=$('#page-journey');
  page.classList.toggle('journey-linear',on);
  page.dataset.scrollEngine=nativeScroll()?'css':'observer';
  $('#journeyReadMode').setAttribute('aria-pressed',String(on));
  $$('.journey-scene').forEach((scene,i)=>{
    scene.inert=!on&&i!==selected;scene.setAttribute('aria-hidden',String(!on&&i!==selected));
  });
  if(active){const index=Math.max(0,selected);loadChapter(index);loadChapter(index+1);queueMeasure();}
}
function init() {
  if(initialized||!entries.length)return;initialized=true;
  const scopes=entries.map((_,i)=>'--month-'+i).join(',');
  $('#journeyTrack').style.setProperty('timeline-scope','--year,'+scopes);
  $('#journeyStage').innerHTML=entries.map(renderChapter).join('');
  $('#journeySteps').innerHTML=entries.map((e,i)=>'<div class="journey-step" id="journey-step-'+esc(e.id)+'" data-index="'+i+'" aria-hidden="true" style="view-timeline-name:--month-'+i+'"></div>').join('');
  $('#journeyRail').innerHTML=entries.map(e=>'<a href="#journey/'+esc(e.id)+'" aria-label="'+months[e.month-1]+': '+esc(e.title)+'" '+(e.month===currentMonth?'class="is-current-month"':'')+'><span>'+digits.format(e.month)+'</span><i aria-hidden="true"></i></a>').join('');
  $('#journeyCurrent').textContent='أنت الآن في شهر '+months[currentMonth-1]+'، تابع من هنا.';
  $('#journeyCurrentLink').href='#journey/'+current().id;
  const teaser=$('#journeyTeaser');
  teaser.href='#journey/'+current().id;
  teaser.innerHTML='<img src="'+esc(current().image.srcset.split(',')[0].trim().split(' ')[0])+'" width="640" height="360" loading="lazy" decoding="async" alt="'+esc(current().image.alt)+'"><span><small>هذا الشهر في عُمان · '+months[currentMonth-1]+'</small><b>'+esc(current().title)+'</b></span><span class="journey-teaser-arrow" aria-hidden="true">←</span>';
  $('#journeySources').innerHTML=entries.map(e=>'<li><h3>'+months[e.month-1]+' · '+esc(e.title)+'</h3><p>'+esc(e.fact)+'</p>'+sourceBody(e)+'</li>').join('');
  $('#journeyPhotoSources').innerHTML=uniquePhotos().map(e=>'<li><b>'+esc(e.image.credit.title)+'</b><p>'+photoCredit(e.image)+'</p><p>'+esc(e.image.credit.changes)+'</p><a href="'+esc(e.image.credit.licenseUrl)+'" target="_blank" rel="noopener noreferrer">نص الترخيص ↗</a></li>').join('');
  const intro=$('#journeyIntroImage');intro.dataset.src=entries[0].image.src;intro.dataset.srcset=entries[0].image.srcset;intro.alt=entries[0].image.alt;
  $('#journeyIntroCredit').innerHTML=photoCredit(entries[0].image);
  const ending=$('#journeyEndingImage');ending.dataset.src=entries.at(-1).image.src;ending.dataset.srcset=entries.at(-1).image.srcset;ending.alt=entries.at(-1).image.alt;
  $('#journeyEndingCredit').innerHTML=photoCredit(entries.at(-1).image);
  if('IntersectionObserver'in window){
    observer=new IntersectionObserver(records=>{
      if(!active)return;
      const hit=records.filter(r=>r.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top))[0];
      if(hit)select(Number(hit.target.dataset.index));
    },{rootMargin:'-45% 0px -45% 0px',threshold:0});
    $$('.journey-step').forEach(el=>observer.observe(el));
    const lazy=new IntersectionObserver(records=>records.forEach(r=>{
      if(!active||!r.isIntersecting)return;
      if(r.target.matches('.journey-scene')){if(linear())loadChapter(Number(r.target.dataset.index));}else loadImage(r.target);
    }),{rootMargin:'200px'});
    $$('.journey-scene').forEach(el=>lazy.observe(el));
    lazy.observe(ending);
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-journey-source]');
    if(!button)return;
    const entry=entries[Number(button.dataset.journeySource)];if(!entry)return;
    sourceOpener=button;$('#journeySourceContent').innerHTML=sourceBody(entry);
    $('#journeySourceTitle').textContent='مصدر حقيقة '+months[entry.month-1];
    $('#journeySourceDialog').showModal();
  });
  const dialog=$('#journeySourceDialog');
  $('#journeySourceClose').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{if(sourceOpener?.isConnected&&!sourceOpener.closest('[inert]'))sourceOpener.focus({preventScroll:true});});
  $('#journeyReadMode').addEventListener('click',()=>{manualLinear=!manualLinear;setMode();if(active&&selected>=0)jump(entries[selected].id,false);});
  [preference,shortViewport].forEach(query=>query.addEventListener?.('change',()=>{setMode();if(active&&selected>=0)jump(entries[selected].id,false);}));
  document.addEventListener('keydown',event=>{
    if(!active||event.ctrlKey||event.metaKey||event.altKey||document.querySelector('dialog[open]')||event.target.closest('input,textarea,select,[contenteditable]'))return;
    const key=event.key;if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(key)&&!event.target.closest('#journeyRail'))return;
    const index=chapterIndex(Math.max(0,selected),key,entries.length);
    if(index===null)return;event.preventDefault();const hash='#journey/'+entries[index].id;if(location.hash===hash)jump(entries[index].id);else location.hash=hash;
  });
  addEventListener('scroll',queueMeasure,{passive:true});addEventListener('resize',queueMeasure,{passive:true});
  setMode();
}
function jump(id,focus=true) {
  const page=$('#page-journey');
  if(!page?.classList.contains('is-active'))return;
  if(id==='end'){
    const end=$('#journeyEnding');end.scrollIntoView({behavior:linear()?'auto':'smooth',block:'start'});
    if(focus)$('#journeyEndingTitle').focus({preventScroll:true});loadImage($('#journeyEndingImage'));return;
  }
  const index=entries.findIndex(e=>e.id===id);
  if(index<0){
    scrollTo({top:0,behavior:linear()?'auto':'smooth'});if(focus)$('#journeyTitle').focus({preventScroll:true});return;
  }
  select(index);
  const target=linear()?$('#journey-chapter-'+id):$('#journey-step-'+id);
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))||80;
  const top=target.getBoundingClientRect().top+scrollY-header;
  // A deliberate chapter jump is immediate; transitions happen inside the stationary scene.
  scrollTo({top,behavior:'instant'});
  if(focus)$('#journey-title-'+id).focus({preventScroll:true});
  queueMeasure();
}
function enter(id) {
  init();active=false;selected=-1;setMode();active=true;
  const index=id==='end'?entries.length-1:entries.findIndex(e=>e.id===id);
  if(index<0)loadImage($('#journeyIntroImage'));
  select(index<0?0:index,false);
  requestAnimationFrame(()=>jump(id||'',true));
}
function leave(){active=false;++serial;if(frame)cancelAnimationFrame(frame);frame=0;}
function uniquePhotos(){return entries.filter((e,i)=>entries.findIndex(x=>x.image.creditId===e.image.creditId)===i);}
function renderCredits() {
  init();
  $('#imageCreditsGrid').innerHTML=uniquePhotos().map(e=>'<figure class="image-credit-card"><img src="'+esc(e.image.srcset.split(',')[0].trim().split(' ')[0])+'" width="640" height="360" loading="lazy" decoding="async" alt="'+esc(e.image.alt)+'"><figcaption><h2>'+esc(e.image.credit.title)+'</h2><p class="source-credit">'+photoCredit(e.image)+'</p><p>'+esc(e.image.credit.changes)+'</p><a class="text-link" href="'+esc(e.image.credit.licenseUrl)+'" target="_blank" rel="noopener noreferrer">نص الترخيص ↗</a></figcaption></figure>').join('');
}
function search(q) {
  const query=fold(q),result=[];
  if(!query||fold('رحلة عام في عمان تقويم شهور مواسم').includes(query))result.push({type:'feature',hash:'journey',icon:'calendar',title:'رحلة عام في عُمان',sub:'اثنا عشر فصلًا ترويها بالتمرير'});
  if(query)entries.filter(e=>fold([e.title,e.place,e.fact,e.season,months[e.month-1]].join(' ')).includes(query)).slice(0,4).forEach(e=>result.push({type:'feature',hash:'journey/'+e.id,icon:'calendar',title:e.title,sub:'رحلة العام · '+months[e.month-1]}));
  if(!query||fold('مصادر صور الرحلة').includes(query))result.push({type:'feature',hash:'image-credits',icon:'image',title:'مصادر صور الرحلة',sub:'المصورون والتراخيص'});
  return result;
}
window.OmaniJourney={init,enter,leave,search,renderCredits,legacy:id=>aliases[id]||id,chapterIndex};
})();
