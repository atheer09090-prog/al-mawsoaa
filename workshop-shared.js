/* أدوات مشتركة للحِرف؛ المحركات تحتفظ بقواعدها وبياناتها المستقلة. */
(() => {
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>new Intl.NumberFormat('ar-OM-u-nu-arab',{maximumFractionDigits:0}).format(v);
function storage(key){return {get(){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}},set(v){try{localStorage.setItem(key,JSON.stringify(v));return true;}catch{return false;}}};}
function saveBest(store,result){const best=store.get();return !best||result.score>best.score?store.set({...result,date:new Date().toISOString()}):false;}
function stars(score){const count=Math.max(1,Math.min(5,Math.ceil(score/20)));return `<div class="ws-stars" aria-label="${n(count)} من خمس نجوم">${'★'.repeat(count)}${'☆'.repeat(5-count)}</div>`;}
function createLoop({step=1/60,maxFrame=.1,uiInterval=.18,canRun,onStep,onDraw,onUI}){
 let frame=0,last=0,acc=0,paint=0,ui=0;
 const stop=()=>{cancelAnimationFrame(frame);frame=0;};
 function loop(time){
  frame=0;if(document.hidden||!canRun())return;
  const dt=last?Math.min(maxFrame,(time-last)/1000):0;last=time;acc+=dt;paint+=dt;ui+=dt;
  while(acc>=step){onStep(step);acc-=step;if(!canRun()){acc=0;break;}}
  const ended=!canRun();
  if(paint>=1/30||ended){onDraw(time/1000);paint=0;}
  if(ui>=uiInterval||ended){onUI();ui=0;}
  if(canRun()&&!document.hidden)frame=requestAnimationFrame(loop);
 }
 return {start(){stop();last=0;acc=0;paint=0;ui=0;if(canRun()&&!document.hidden)frame=requestAnimationFrame(loop);},stop};
}
function sources({root,config,id,credit='',compact=false,pause=()=>{},resume=()=>{}}){
 const previous=document.activeElement;pause();
 const d=document.createElement('dialog');d.className='ws-dialog';d.setAttribute('aria-label',id?'مصدر المعلومة':'مصادر هذه الحرفة');
 const list=id?config.facts.filter(f=>f.id===id):config.facts;
 d.innerHTML=`<div class="ws-dialog-top"><h2>${id?'مصدر المعلومة':'مصادر هذه الحرفة'}</h2><button class="ws-tool" type="button" data-close>إغلاق ×</button></div>${list.map(f=>{const s=f.source;return `<article class="ws-source-record"><span class="ws-source-badge">${s.kind==='encyclopedia'?'من الموسوعة العُمانية':s.kind==='field'?'مقابلة ميدانية':'مصدر مساند'}</span><h3>${esc(s.entryTitle)}</h3><p>${esc(f.text)}</p>${compact?'<details><summary>تفاصيل المرجع</summary>':''}<dl><dt>المجلد</dt><dd>${esc(s.volume??'غير متاح')}</dd><dt>الصفحة</dt><dd>${esc(s.page??'غير متاحة')}</dd></dl><p>${esc(s.note)}</p>${s.url?`<a class="text-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">افتح المرجع الأصلي ↗</a>`:'<p>المرجع صورة صفحة أرسلها صاحب المشروع؛ لا يتوفر رابط رقمي.</p>'}${compact?'</details>':''}</article>`;}).join('')}${!id&&!compact?`<h3>${esc(config.confirmationTitle||'تحتاج تأكيدًا ميدانيًا')}</h3><ul>${config.needsConfirmation.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>حدود النسخة الحالية</h3><ul>${config.omitted.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p>${credit}</p>`:compact?`<p>${credit}</p>`:''}`;
 root.append(d);d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close();});d.addEventListener('close',()=>{d.remove();resume();if(previous?.isConnected)previous.focus({preventScroll:true});},{once:true});d.showModal();return d;
}
window.WorkshopShared={esc,n,storage,saveBest,stars,createLoop,sources};
})();
