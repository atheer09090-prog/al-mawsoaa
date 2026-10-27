(() => {
'use strict';
const C=window.OMANI_HALWA,T=C.tuning,E=window.HalwaEngine,S=window.WorkshopShared;
const root=document.getElementById('workshopRoot');
const {esc,n}=S;
const clock=v=>n(Math.floor(v/60))+':'+n(Math.floor(v%60)).padStart(2,'٠');
const $=s=>root.querySelector(s);
const fact=id=>C.facts.find(f=>f.id===id);
const sourceButton=id=>`<button type="button" class="ws-source" data-source="${id}" aria-label="مصدر: ${esc(fact(id)?.text)}">المصدر ↗</button>`;
const factHTML=id=>`<p class="ws-fact">${esc(fact(id).text)} ${sourceButton(id)}</p>`;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let quiet=false;const reduced=()=>motion.matches||quiet;
let game=null,active=false,paused=false,speed=1,held=false,pouring=false,pointer=null,
 lastStage=-1,lastErrors=0,lastStatus='',announcement='',saved=false,currentPhoto=null,nextPhoto=null,photoBlend=0,photoKey='',images=new Map(),portrait=matchMedia('(max-width:600px)');
const storage=S.storage(T.bestKey);
const runtime=S.createLoop({step:T.step,maxFrame:T.maxFrame,uiInterval:T.uiInterval,
 canRun:()=>active&&game&&!paused&&!game.state.done,
 onStep:dt=>{if(held){if(game.state.stage===6)game.pour(dt);else game.stir(dt*T.keyboardTurns);}game.tick(dt,speed);},onDraw:draw,onUI:update});
function announce(text){if(text===announcement)return;announcement=text;$('#wsLive').textContent=text;}
function credit(){const c=C.media.credit;return `<a href="${c.url}" target="_blank" rel="noopener noreferrer">صورة الحلوى: ${c.author}</a> · <a href="${c.licenseUrl}" target="_blank" rel="noopener noreferrer">${c.license}</a> · اقتصاص وتصغير. <a href="data/halwa-image-credits.json" download>السجل</a>`;}
function intro(){
 runtime.stop();game=null;lastStage=-1;lastErrors=0;currentPhoto=null;nextPhoto=null;photoKey='';
 const best=storage.get();
 root.innerHTML=`<div class="ws-intro"><div class="ws-intro-copy"><p class="eyebrow">كيف تُصنع؟ · تجربة تفاعلية</p><h1 id="workshopTitle" tabindex="-1">حرفةٌ تُحسّ،<br><em>ومعرفةٌ تُجرَّب.</em></h1><p class="ws-lead">جرّب صنع الحلوى العُمانية بنفسك. حرّك، واضبط النار، وراقب أثر كل قرار.</p>${factHTML('culture')}<div class="ws-safety">${esc(C.safety)}</div><fieldset class="ws-modes"><legend>كيف تريد أن تبدأ؟</legend><label><input type="radio" name="ws-mode" value="learn" checked><span><b>تعلّم</b><small>توجيه وتفسير أثناء التجربة</small></span></label><label><input type="radio" name="ws-mode" value="challenge"><span><b>تحدٍّ</b><small>اعتمد على ملاحظتك ثم قيّم النتيجة</small></span></label></fieldset><button class="button button-primary" type="button" id="wsBegin">ابدأ التجربة <span aria-hidden="true">←</span></button>${best?`<p class="ws-best">أفضل محاولة محفوظة: ${n(best.score)} من ١٠٠</p>`:''}</div><figure class="ws-intro-photo"><img src="${C.media.reference}" alt="صورة حقيقية للحلوى العُمانية بالزعفران داخل وعاء معدني" width="900" height="900" decoding="async"><figcaption>الحلوى العُمانية <small>${credit()}</small></figcaption></figure></div><details class="ws-about"><summary>عن هذه النسخة ومراجعها</summary><p>${esc(C.limits)}</p>${factHTML('duration')}<button class="button button-ghost" type="button" data-all-sources>مصادر هذه الحرفة</button></details><div id="wsLive" class="sr-only" aria-live="polite" aria-atomic="true"></div>`;
 $('#wsBegin').addEventListener('click',()=>start($('input[name="ws-mode"]:checked').value));
 $('#workshopTitle').focus({preventScroll:true});scrollTo({top:0,behavior:'auto'});
}
function start(mode){
 game=E.create(C,mode);paused=false;saved=false;lastStage=-1;lastErrors=0;lastStatus='';speed=1;held=false;pouring=false;
 root.innerHTML=`<div class="ws-game-heading"><div><p class="eyebrow">ورشة الحِرف · ${mode==='learn'?'تعلّم':'تحدٍّ'}</p><h1 id="workshopTitle" tabindex="-1">الحلوى العُمانية، بيدك.</h1></div><div class="ws-game-tools"><button type="button" class="ws-tool" id="wsPause">إيقاف مؤقت</button><button type="button" class="ws-tool" data-all-sources>المراجع</button><button type="button" class="ws-tool" id="wsQuiet" aria-pressed="false">حركة هادئة</button><button type="button" class="ws-tool" id="wsRestart">ابدأ من جديد</button></div></div>
 <ol class="ws-steps" aria-label="مراحل التجربة">${C.stages.map((s,i)=>`<li data-step="${i}"><span>${n(i+1)}</span>${s.short}</li>`).join('')}</ol>
 <div class="ws-layout"><aside class="ws-phase"><p class="eyebrow" id="wsStageNumber"></p><h2 id="wsStageTitle"></h2><div id="wsFact"></div><p class="ws-hint" id="wsHint"></p><div class="ws-preparation" id="wsPreparation"></div><p class="ws-feedback" id="wsFeedback" role="status"></p><button class="button button-primary ws-next" id="wsNext" type="button"></button><button class="ws-source" id="wsSkip" type="button" hidden>استخدم المعلق دون إكمال خلطه</button></aside>
 <div class="ws-workbench"><div class="ws-scene" id="wsScene"><canvas id="wsCanvas" width="640" height="640" tabindex="0" role="application" aria-label="مساحة العمل. حرّك في دوائر باللمس أو الماوس، أو اضغط مفتاح المسافة باستمرار للتحريك. في مرحلة التقديم اضغط المسافة للسكب والتسوية." aria-describedby="wsCanvasHelp"></canvas><span class="ws-temporary" id="wsTemporary">مشهد مؤقت مولّد بالكود</span><span class="ws-scene-label" id="wsSceneLabel"></span></div><p class="ws-canvas-help" id="wsCanvasHelp">حرّك داخل الوعاء في دوائر · أو اضغط مطولًا على المسافة</p><button class="ws-stir" id="wsStir" type="button">اضغط مطولًا للتحريك</button><div class="ws-pause-cover" id="wsPauseCover" hidden><b>التجربة متوقفة</b><p>القدر والمؤقت في أمان أثناء توقفك.</p><button class="button button-primary" id="wsResume" type="button">واصل التجربة</button></div></div>
 <aside class="ws-instruments"><fieldset class="ws-heat"><legend>قوة النار</legend><div class="ws-dial" aria-hidden="true"><i id="wsNeedle"></i><span id="wsHeatLabel">مطفأة</span></div><label class="sr-only" for="wsHeat">قوة النار من مطفأة إلى عالية</label><input id="wsHeat" type="range" min="0" max="3" step="1" value="0"><div class="ws-scale"><span>مطفأة</span><span>هادئة</span><span>متوسطة</span><span>عالية</span></div></fieldset>
 <div class="ws-meter"><span>مؤشر الحرارة <small>افتراضي</small></span><progress id="wsTemperature" max="100" value="0" aria-label="مؤشر الحرارة الافتراضي"></progress><output id="wsTemperatureText"></output></div><div class="ws-meter"><span id="wsConsistencyLabel">القوام</span><progress id="wsConsistency" max="100" value="0" aria-labelledby="wsConsistencyLabel"></progress><output id="wsConsistencyText"></output></div><div class="ws-stir-status"><span id="wsStirText"></span><small id="wsMixText"></small></div>
 <div class="ws-timer"><span>زمن اللعب <output id="wsTime">٠:٠٠</output></span><span>المكافئ الافتراضي <output id="wsVirtual">٠:٠٠</output></span><small>كل ثانية لعب = دقيقة افتراضية عند ×١؛ ليست مدة وصفة.</small><label>سرعة التجربة <select id="wsSpeed"><option value="1">×١</option><option value="2">×٢</option></select></label></div></aside></div>
 <section class="ws-shelf" aria-labelledby="wsShelfTitle"><div class="ws-shelf-heading"><h2 id="wsShelfTitle">رفّ المكونات</h2><p id="wsShelfHelp">اختر بالضغط أو بالسحب إلى الوعاء.</p>${sourceButton('ingredients')}</div><div class="ws-ingredients">${C.ingredients.map(i=>`<button class="ws-ingredient" type="button" draggable="true" data-ingredient="${i.id}" aria-pressed="false"><span class="ws-ingredient-swatch ws-tone-${i.tone}" aria-hidden="true"></span><b>${i.name}</b><small></small></button>`).join('')}</div></section>
 <details class="ws-about"><summary>كيف تعمل المحاكاة؟</summary><p>${esc(C.limits)}</p>${factHTML('duration')}<p>المقادير هنا رمزية بلا أوزان. السمن مقسم إلى أزرار إضافة لتوضيح المزج، دون ادعاء أن هذه نسبة أو طريقة وحيدة. مقاومة المجداف والاحتراق والتقييم نماذج تعليمية تحتاج معايرة ميدانية.</p><p>لا صوت في هذه النسخة. توضح النصوص الغليان والتحريك والتصاق القاع. تُوقف التجربة عند إخفاء التبويب أو قراءة المراجع.</p></details><section id="wsResult" hidden></section><div id="wsLive" class="sr-only" aria-live="polite" aria-atomic="true"></div>`;
 bindGame();update(true);$('#workshopTitle').focus({preventScroll:true});loopStart();
}
function bindGame(){
 const canvas=$('#wsCanvas'),scene=$('#wsScene');
 $('#wsQuiet').setAttribute('aria-pressed',String(reduced()));$('#wsQuiet').addEventListener('click',()=>{quiet=!quiet;$('#wsQuiet').setAttribute('aria-pressed',String(reduced()));announce(reduced()?'حركة هادئة بلا جسيمات أو اهتزاز.':'استؤنفت المؤثرات البصرية.');draw(performance.now()/1000);});
 $('#wsHeat').addEventListener('input',e=>{game.setHeat(e.target.value);announce(['أطفئت النار','النار هادئة','النار متوسطة','النار عالية'][game.state.heat]);update(true);});
 $('#wsSpeed').addEventListener('change',e=>{speed=Number(e.target.value);game.log('سرعة التجربة ×'+n(speed));});
 $('#wsPause').addEventListener('click',()=>setPaused(!paused));$('#wsResume').addEventListener('click',()=>setPaused(false));
 $('#wsRestart').addEventListener('click',()=>{setPaused(true);const d=document.createElement('dialog');d.className='ws-dialog';d.innerHTML='<h2>بدء محاولة جديدة؟</h2><p>ستُمسح هذه المحاولة فقط، وتبقى أفضل نتيجة محفوظة.</p><button class="button button-primary" data-yes>ابدأ من جديد</button> <button class="button button-ghost" data-no>واصل محاولتي</button>';root.append(d);d.querySelector('[data-yes]').onclick=()=>{d.close();d.remove();intro();};d.querySelector('[data-no]').onclick=()=>d.close();d.addEventListener('close',()=>{if(d.isConnected){d.remove();setPaused(false);}});d.showModal();});
 $('#wsNext').addEventListener('click',()=>advance());$('#wsSkip').addEventListener('click',()=>advance(true));
 const hold=$('#wsStir');
 hold.addEventListener('pointerdown',e=>{if(paused)return;held=true;hold.setPointerCapture(e.pointerId);e.preventDefault();});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])hold.addEventListener(ev,()=>{held=false;});
 hold.addEventListener('keydown',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();held=true;}});
 hold.addEventListener('keyup',()=>{held=false;});hold.addEventListener('blur',()=>{held=false;});
 const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};
 canvas.addEventListener('pointerdown',e=>{if(paused||!game||game.state.stage===0)return;const p=point(e);pointer={id:e.pointerId,angle:Math.atan2(p.y,p.x),x:p.x,y:p.y};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});e.preventDefault();});
 canvas.addEventListener('pointermove',e=>{
  if(!pointer||pointer.id!==e.pointerId||paused)return;const p=point(e);
  if(game.state.stage===6){if(Math.hypot(p.x-pointer.x,p.y-pointer.y)>.005)game.pour(.12);}
  else if(Math.hypot(p.x,p.y)>.06&&Math.hypot(p.x,p.y)<.49){let a=Math.atan2(p.y,p.x),d=a-pointer.angle;d=Math.atan2(Math.sin(d),Math.cos(d));game.stir(d/(Math.PI*2));pointer.angle=a;}
  pointer.x=p.x;pointer.y=p.y;
 });
 const release=()=>{pointer=null;};for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,release);
 canvas.addEventListener('keydown',e=>{if([' ','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();if(!paused)held=true;}});canvas.addEventListener('keyup',()=>{held=false;});canvas.addEventListener('blur',()=>{held=false;pointer=null;});
 root.querySelectorAll('[data-ingredient]').forEach(b=>{
  b.addEventListener('click',()=>add(b.dataset.ingredient));
  b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',b.dataset.ingredient);e.dataTransfer.effectAllowed='copy';});
 });
 scene.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';});
 scene.addEventListener('drop',e=>{e.preventDefault();add(e.dataTransfer.getData('text/plain'));});
}
function add(id){if(!game||paused||game.state.done)return;if(game.add(id)){announce('أُضيف '+C.ingredients.find(i=>i.id===id).name);}update(true);}
function advance(force=false){if(paused||!game)return;if(game.state.done){intro();return;}if(game.next(force)){held=false;pointer=null;update(true);if(game.state.done)finish();else {$('#wsStageTitle').focus({preventScroll:true});$('#wsStageTitle').scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'});}}}
function setPaused(value){if(game?.state.done){paused=false;return;}paused=value;held=false;pouring=false;pointer=null;if(!game)return;$('#wsPause').textContent=value?'واصل التجربة':'إيقاف مؤقت';$('#wsPauseCover').hidden=!value;$('#wsHeat').disabled=value;root.querySelectorAll('[data-ingredient]').forEach(b=>b.disabled=value||b.dataset.unavailable==='true');$('#wsNext').disabled=value||!game.ready();if(value)runtime.stop();else loopStart();announce(value?'توقفت المحاكاة والمؤقت.':'استؤنفت التجربة.');}
function loopStart(){runtime.start();}
function ingredientState(i){
 const s=game.state;if(s.stage===0)return {available:true,used:s.selected.includes(i.id),text:s.selected.includes(i.id)?'على رفّك':'اختر'};
 if(s.stage===1)return {available:['water','starch'].includes(i.id)&&!(i.id==='water'?s.slurryWater:s.slurryStarch),used:i.id==='water'?s.slurryWater:i.id==='starch'?s.slurryStarch:false,text:i.id==='water'&&s.slurryWater||i.id==='starch'&&s.slurryStarch?'أُضيف':['water','starch'].includes(i.id)?'للوعاء':'لاحقًا'};
 if(s.stage>=2&&s.stage<=5){let used=i.id==='water'?s.added.water:i.id==='sugar'?s.added.sugar:i.id==='starch'?s.slurryAdded:i.id==='ghee'?s.ghee>=1:i.id==='aromas'?s.aromas:i.id==='nuts'?s.nuts:false;return {available:!i.distractor&&!used,used,text:i.id==='ghee'&&s.ghee>0?n(s.ghee*100)+'٪ من حصة اللعبة':used?'أُضيف':i.id==='starch'?'أضف المعلق':'أضف'};}
 return {available:false,used:!i.distractor&&s.selected.includes(i.id),text:i.distractor?'خارج التجربة':'اكتمل'};
}
function requirement(){
 const s=game.state;
 return [
  `اخترت ${n(s.selected.length)} من ${n(C.ingredients.filter(i=>!i.distractor).length)} مكونات.`,
  !s.slurryWater?'أضف الماء إلى وعاء التحضير.':!s.slurryStarch?'أضف النشا إلى الماء.':`تحضير المعلق: ${n(s.starchDissolved*100)}٪`,
  !s.added.water?'أضف الماء إلى القدر.':s.temperature<T.boil?'ارفع النار وانتظر الغليان الافتراضي.':!s.added.sugar?'أضف السكر، ثم حرّك.':`امتزاج السكر: ${n(s.sugarDissolved*100)}٪`,
  !s.slurryAdded?'أضف معلق النشا من الرف.':`القوام: ${n(s.consistency*100)}٪ · المجال التالي يبدأ عند ${n(T.gel*100)}٪`,
  s.ghee<1?'أضف السمن وحرّك ليمتزج.':s.gheeIntegration<T.readyThreshold?`امتزاج السمن: ${n(s.gheeIntegration*100)}٪`:!s.aromas?'أضف النكهات من الرف.':!s.nuts?'أضف المكسرات من الرف.':'الإضافات مكتملة.',
  s.heat>0?'قرارك: أطفئ النار عندما تقتنع بالقوام، ثم ارفع القدر.':'يمكنك رفع القدر الآن؛ سيعكس التقييم القوام الذي اخترته.',
  s.poured<T.readyThreshold?`اسكب إلى الطبق: ${n(s.poured*100)}٪`:s.levelled<T.readyThreshold?`سوِّ السطح: ${n(s.levelled*100)}٪`:`تبريد افتراضي: ${n(s.cooled*100)}٪`,
  'انتهت التجربة.'
 ][s.stage];
}
function update(force=false){
 if(!game)return;const s=game.state,stage=game.stage();
 if(lastStage!==s.stage){
  lastStage=s.stage;$('#wsStageTitle').textContent=stage.title;$('#wsStageTitle').setAttribute('tabindex','-1');$('#wsStageNumber').textContent=`المرحلة ${n(s.stage+1)} من ${n(C.stages.length)}`;
  $('#wsFact').innerHTML=factHTML(stage.fact);$('#wsHint').textContent=stage.hint;$('#wsHint').hidden=s.mode!=='learn';
  root.querySelectorAll('[data-step]').forEach(el=>{const i=Number(el.dataset.step);if(i===s.stage)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.classList.toggle('is-done',i<s.stage);});
  $('#wsSkip').hidden=s.stage!==1;$('#wsNext').textContent=stage.next;
  $('#wsHeat').disabled=s.stage<2||s.stage>5;$('#wsStir').hidden=s.stage===0||s.stage===7;
  $('#wsStir').textContent=s.stage===6?'اضغط مطولًا للسكب والتسوية':'اضغط مطولًا للتحريك';
  $('#wsSceneLabel').textContent=s.stage===1?'وعاء تحضير النشا':s.stage>=6?'طبق التقديم':'المرجل · منظر علوي';
  requestPhoto(s.stage);if(!reduced()){const scene=$('#wsScene');scene.classList.remove('is-changing');void scene.offsetWidth;scene.classList.add('is-changing');}announce(stage.title);
 }
 $('#wsPreparation').textContent=requirement();$('#wsNext').disabled=paused||(!s.done&&!game.ready());
 $('#wsHeat').value=s.heat;$('#wsHeat').disabled=paused||s.stage<2||s.stage>5;$('#wsHeatLabel').textContent=['مطفأة','هادئة','متوسطة','عالية'][s.heat];$('#wsNeedle').style.transform=`rotate(${-110+s.heat*220/3}deg)`;
 $('#wsTemperature').value=s.temperature;$('#wsTemperatureText').textContent=(s.temperature>=T.hot?'مرتفعة':s.temperature>=T.boil?'غليان افتراضي':s.temperature>T.minimumHeat?'دافئة':'باردة')+' · '+n(s.temperature)+' / ١٠٠';
 const value=s.stage===1?s.starchDissolved:s.consistency;
 $('#wsConsistency').value=value*100;$('#wsConsistencyLabel').textContent=s.stage===1?'تحضير المعلق':'القوام';
 $('#wsConsistencyText').textContent=s.stage===1?n(value*100)+'٪':(value<T.gel?'سائل':value<T.done?'هلامي':value<T.overdone?'هلامي غليظ':'متصلب في النموذج')+' · '+n(value*100)+'٪';
 const stirring=s.stirRate>=T.stirMin;$('#wsStirText').textContent=stirring?'● تحريك جارٍ':'○ التحريك متوقف';$('#wsMixText').textContent=s.stage===1?'حركة دائرية داخل الوعاء':`انتظام الحركة ${n(s.regularity*100)}٪ · امتزاج السمن ${n(s.gheeIntegration*100)}٪`;
 $('#wsTime').textContent=clock(s.elapsed);$('#wsVirtual').textContent=clock(s.virtual*T.clockRatio);
 root.querySelectorAll('[data-ingredient]').forEach(b=>{const st=ingredientState(C.ingredients.find(i=>i.id===b.dataset.ingredient));b.disabled=paused||!st.available;b.dataset.unavailable=String(!st.available);b.setAttribute('aria-pressed',String(st.used));b.querySelector('small').textContent=st.text;b.draggable=st.available&&!paused;});
 let status=s.burn>.25?'احتراق ظاهر · ابدأ محاولة جديدة':s.sticking>.2?'بدأ القاع يلتصق · خفّض النار وحرّك':s.temperature>=T.boil?'فقاعات وغليان افتراضي':s.stirRate>=T.stirMin?'تحريك الخليط جارٍ':'راقب أثر قراراتك';
 const recent=s.errors.at(-1);if(recent&&s.elapsed-recent.at<T.feedbackDuration)status=recent.message;
 $('#wsFeedback').textContent=status;$('#wsFeedback').classList.toggle('is-warning',s.sticking>.2||s.burn>.25);
 if(status!==lastStatus){lastStatus=status;announce(status);}
 if(s.errors.length>lastErrors){const e=s.errors.at(-1);announce(e.message);lastErrors=s.errors.length;if(!reduced()&&navigator.vibrate)try{navigator.vibrate(35);}catch{}}
 if(force)draw(performance.now()/1000);
}
function requestPhoto(index){
 const available=window.OMANI_HALWA_MEDIA||C.media.available;
 for(const i of [index,index+1]){
  const key=C.media.scenes[C.stages[i]?.id];if(!key)continue;
  const preferred=key+(portrait.matches?'-square':'-wide')+'.webp';
  const file=available.includes(preferred)?preferred:available.includes(key+'-square.webp')?key+'-square.webp':null;
  if(!file)continue;
  if(!images.has(file)){const image=new Image();image.decoding='async';image.onload=()=>{if(i===game?.state.stage){nextPhoto=image;photoBlend=0;photoKey=file;}};image.src=C.media.directory+file;images.set(file,image);}
  const image=images.get(file);if(i===index&&image.complete&&image.naturalWidth){nextPhoto=image;photoBlend=0;photoKey=file;}
 }
 const key=C.media.scenes[C.stages[index]?.id];
 if(!key||!available.some(f=>f.startsWith(key+'-'))){currentPhoto=null;nextPhoto=null;photoKey='';}
}
// رسوم مؤقتة بملمس وإضاءة، تُستبدل باللقطات الموثقة دون تغيير منطق التجربة.
let grain=null;
function noise(){if(grain)return grain;const c=document.createElement('canvas');c.width=c.height=180;const x=c.getContext('2d'),im=x.createImageData(180,180);let seed=17;for(let p=0;p<im.data.length;p+=4){seed=(seed*16807)%2147483647;const v=seed%255;im.data[p]=im.data[p+1]=im.data[p+2]=v;im.data[p+3]=26;}x.putImageData(im,0,0);grain=c;return c;}
const mix=(a,b,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');
function draw(time){
 const canvas=$('#wsCanvas');if(!canvas||!game)return;const x=canvas.getContext('2d'),s=game.state,slurry=s.stage===1,plate=s.stage>=6,r=slurry?180:plate?216:231,cx=320,cy=320;
 x.clearRect(0,0,640,640);const bg=x.createRadialGradient(300,270,50,320,320,470);bg.addColorStop(0,'#34453d');bg.addColorStop(1,'#122c2e');x.fillStyle=bg;x.fillRect(0,0,640,640);
 x.save();x.globalAlpha=.12;x.fillStyle=x.createPattern(noise(),'repeat');x.fillRect(0,0,640,640);x.restore();
 if(!plate&&s.heat>0){const glow=x.createRadialGradient(cx,cy,r-5,cx,cy,r+70);glow.addColorStop(0,'#bf8c3400');glow.addColorStop(.35,'#e58b32'+Math.round(s.heat/3*145).toString(16).padStart(2,'0'));glow.addColorStop(1,'#bf8c3400');x.fillStyle=glow;x.beginPath();x.arc(cx,cy,r+70,0,7);x.fill();}
 x.save();x.shadowColor='#0009';x.shadowBlur=30;x.shadowOffsetY=18;
 const metal=x.createLinearGradient(50,80,540,590);metal.addColorStop(0,plate||slurry?'#e8e2cc':'#f4c98b');metal.addColorStop(.2,plate||slurry?'#8f9987':'#754020');metal.addColorStop(.5,plate||slurry?'#fff9e5':'#d49b58');metal.addColorStop(.8,plate||slurry?'#b5b9a5':'#784629');metal.addColorStop(1,'#e0bd79');
 x.fillStyle=metal;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();x.restore();
 if(!plate&&!slurry){for(const xx of [43,567]){x.strokeStyle='#ba874a';x.lineWidth=13;x.beginPath();x.ellipse(xx+15,320,22,46,0,0,7);x.stroke();}}
 x.strokeStyle=plate||slurry?'#f3ebd3':'#f1be7c';x.lineWidth=3;x.beginPath();x.arc(cx,cy,r-8,0,7);x.stroke();
 x.save();x.beginPath();x.arc(cx,cy,r-22,0,7);x.clip();
 let f=slurry?0:s.color;const colours=s.stage===0?T.colours.empty:slurry?(s.slurryWater?['#e9dfc5','#c8bfa6']:T.colours.empty):f<.5?[mix(T.colours.pale[0],T.colours.gold[0],f*2),mix(T.colours.pale[1],T.colours.gold[1],f*2)]:[mix(T.colours.gold[0],T.colours.amber[0],(f-.5)*2),mix(T.colours.gold[1],T.colours.amber[1],(f-.5)*2)];
 if(s.burn>.1){colours[0]=mix(colours[0],T.colours.burnt[0],s.burn);colours[1]=mix(colours[1],T.colours.burnt[1],s.burn);}
 const liquid=x.createRadialGradient(250,235,12,330,330,r);liquid.addColorStop(0,colours[0]);liquid.addColorStop(.65,colours[1]);liquid.addColorStop(1,'#221d16');x.fillStyle=liquid;x.fillRect(80,80,480,480);
 x.globalAlpha=.25;x.fillStyle=x.createPattern(noise(),'repeat');x.fillRect(70,70,500,500);x.globalAlpha=1;
 const moving=s.stirRate>T.stirMin&&!reduced(),angle=moving?s.angle:0;
 if(s.stage>0){x.save();x.translate(cx,cy);x.rotate(angle*.18);for(let i=0;i<8;i++){x.strokeStyle=`rgba(255,224,161,${.035+(s.consistency*.025)})`;x.lineWidth=2+s.consistency*4;x.beginPath();x.ellipse(0,0,40+i*19,18+i*19,-.25,0,Math.PI*1.8);x.stroke();}x.restore();}
 if(slurry||s.lumps>0){const amount=slurry?(s.slurryStarch?1-s.starchDissolved:0):s.lumps;for(let i=0;i<Math.round(amount*14);i++){x.fillStyle='#eee0ba';x.beginPath();x.ellipse(200+(i*73)%240,190+(i*47)%260,7,5,i,0,7);x.fill();}}
 if(s.ghee>s.gheeIntegration){x.fillStyle='#efbe62aa';for(let i=0;i<8;i++){x.beginPath();x.ellipse(cx+Math.cos(i)*155,cy+Math.sin(i)*155,12*(s.ghee-s.gheeIntegration),6,i,0,7);x.fill();}}
 if(s.nuts)for(let i=0;i<18;i++){x.save();x.translate(170+(i*83)%300,170+(i*59)%300);x.rotate(i*2.3);x.fillStyle='#d5b286';x.beginPath();x.ellipse(0,0,6,3,0,0,7);x.fill();x.restore();}
 if(!reduced()&&s.temperature>T.boil&&s.stage<6){for(let i=0;i<T.particleCount;i++){const phase=(time*.6+i*.13)%1,xx=170+(i*67)%300,yy=180+(i*97)%280;x.strokeStyle='#f6d68b55';x.lineWidth=1;x.beginPath();x.arc(xx,yy,1+phase*7,0,7);x.stroke();}}
 if(plate&&s.poured<T.readyThreshold){x.globalAlpha=1-s.poured;x.fillStyle='#ded6bb';x.fillRect(80,80,480,480);x.globalAlpha=1;}
 if(s.sticking>.15){x.strokeStyle=`rgba(33,20,10,${s.sticking*.8})`;x.lineWidth=9+s.sticking*10;x.beginPath();x.arc(cx,cy,r-27,0,7);x.stroke();}
 x.restore();
 const drawPhoto=image=>{const k=Math.min(640/image.naturalWidth,640/image.naturalHeight),w=image.naturalWidth*k,h=image.naturalHeight*k;x.drawImage(image,(640-w)/2,(640-h)/2,w,h);};
 if(currentPhoto){drawPhoto(currentPhoto);}
 if(nextPhoto){photoBlend=reduced()?1:Math.min(1,photoBlend+.035);x.globalAlpha=photoBlend;drawPhoto(nextPhoto);x.globalAlpha=1;if(photoBlend===1){currentPhoto=nextPhoto;nextPhoto=null;}}
 if(!reduced()&&!plate&&s.temperature>T.boil){for(let i=0;i<7;i++){const phase=(time*.15+i*.17)%1;x.fillStyle=s.burn>.25?`rgba(173,166,150,${(1-phase)*.16})`:`rgba(245,245,223,${(1-phase)*.09})`;x.beginPath();x.ellipse(190+i*43+Math.sin(time+i)*9,270-phase*210,14+phase*25,20+phase*30,0,0,7);x.fill();}}
 if(s.stage>0&&s.stage<6||plate&&s.levelled<T.readyThreshold){
  x.save();x.translate(cx,cy);x.rotate(reduced()?-.45:s.angle-.45);x.shadowColor='#0008';x.shadowOffsetY=9;x.shadowBlur=8;const wood=x.createLinearGradient(-13,0,18,0);wood.addColorStop(0,'#684327');wood.addColorStop(.4,'#d4a66c');wood.addColorStop(.7,'#a67540');wood.addColorStop(1,'#59371e');x.fillStyle=wood;x.beginPath();x.roundRect(-13,-300,26,310,8);x.fill();x.beginPath();x.ellipse(0,40,32,64,0,0,7);x.fill();x.shadowColor='transparent';x.strokeStyle='#74502888';x.lineWidth=1;for(let i=0;i<4;i++){x.beginPath();x.moveTo(-7+i*5,-280);x.bezierCurveTo(-2+i*4,-160,-9+i*5,-70,-6+i*5,10);x.stroke();}x.restore();
 }
 $('#wsTemporary').hidden=!!currentPhoto;$('#wsTemporary').textContent=currentPhoto?'':'مشهد مؤقت مولّد بالكود';
}
function finish(){
 runtime.stop();$('#wsPause').disabled=true;const result=game.result(),s=game.state,best=storage.get();
 saved=S.saveBest(storage,{score:result.score,mode:s.mode});
 $('#wsResult').hidden=false;$('#wsResult').className='ws-result';
 const ideal=['اختيار المكونات','تحضير معلق ناعم','الماء المغلي ثم السكر','النشا والتقليب','السمن ثم النكهات والمكسرات','قوام هلامي غليظ ثم إطفاء النار','التفريغ والتبريد مكشوفة'];
 $('#wsResult').innerHTML=`<div class="ws-result-heading"><p class="eyebrow">من المعرفة إلى التجربة</p><h2 tabindex="-1" id="wsResultTitle">${result.score>=80?'أحسنت، ثمرة صبرك أمامك.':result.score>=50?'كل محاولة تعلّمك شيئًا.':'ابدأ من جديد، وراقب الفرق.'}</h2>${S.stars(result.score)}<p>نتيجة التجربة ${n(result.score)} من ١٠٠ · ${s.mode==='learn'?'وضع التعلّم':'وضع التحدّي'}</p><p>${result.reasons.length?result.reasons.map(esc).join('<br>'):'أكملت ترتيب التجربة، وحرّكت الخليط، وضبطت قرار رفع القدر.'}</p><p class="ws-best">${saved?'حُفظت أفضل نتيجة على هذا الجهاز.':best?'أفضل نتيجة محفوظة: '+n(Math.max(best.score,result.score))+' من ١٠٠.':'لم يتوفر التخزين المحلي؛ تبقى النتيجة ظاهرة هنا.'}</p><button class="button button-primary" id="wsAgain" type="button">أعد المحاولة</button></div><div class="ws-reference"><img src="${C.media.reference}" width="900" height="900" loading="lazy" alt="صورة مرجعية لحلوى عُمانية حقيقية"><p>صورة مرجعية حقيقية؛ نتيجة محاولتك تظهر في الطبق داخل المشهد.</p><small>${credit()}</small></div><div class="ws-timeline"><h3>قراراتك على خط الزمن</h3><p>المقارنة لترتيب التجربة، وليست جدول أزمنة تصنيع.</p><div class="ws-table-scroll"><table><thead><tr><th>المرحلة</th><th>المسار المرجعي</th><th>ما فعلته · زمن اللعب</th></tr></thead><tbody>${C.stages.slice(0,7).map((st,i)=>`<tr><th>${st.title}</th><td>${ideal[i]} ${sourceButton(st.fact)}</td><td>${s.log.filter(l=>l.stage===i).map(l=>`<span class="${l.kind==='error'?'ws-log-error':''}">${clock(l.at)} · ${esc(l.label)}</span>`).join('')}</td></tr>`).join('')}</tbody></table></div></div><div class="ws-result-sources"><h3>مصادر هذه الحرفة</h3><p>مراجع مساندة؛ لا توجد إحالة إلى مجلد من الموسوعة في هذه النسخة.</p><button class="button button-ghost" type="button" data-all-sources>افتح المصادر وحدود المعلومات</button>${factHTML('serve')}</div>`;
 $('#wsAgain').onclick=()=>intro();$('#wsResultTitle').focus({preventScroll:true});$('#wsResult').scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'});announce('اكتملت التجربة. النتيجة '+n(result.score)+' من مئة.');draw(performance.now()/1000);
}
function showSources(id){
 const wasPaused=paused;
 S.sources({root,config:C,id,credit:credit(),pause:()=>{if(game&&!game.state.done)setPaused(true);},resume:()=>{if(game&&!game.state.done&&!wasPaused&&active&&!document.hidden)setPaused(false);}});
}
root.addEventListener('click',e=>{const b=e.target.closest('[data-source],[data-all-sources]');if(b)showSources(b.dataset.source);});
document.addEventListener('visibilitychange',()=>{if(!active)return;if(document.hidden&&game&&!game.state.done){setPaused(true);}else if(game&&paused)announce('التجربة متوقفة؛ اضغط واصل التجربة عندما تكون مستعدًا.');});
window.addEventListener('blur',()=>{held=false;pointer=null;});
motion.addEventListener('change',()=>{if(game){$('#wsQuiet').setAttribute('aria-pressed',String(reduced()));draw(performance.now()/1000);}});
window.OmaniWorkshop={
 enter(){active=true;if(!root.querySelector('.ws-intro, .ws-layout'))intro();if(game){setPaused(true);$('#workshopTitle').focus({preventScroll:true});}else $('#workshopTitle')?.focus({preventScroll:true});},
 leave(){active=false;runtime.stop();held=false;pointer=null;root.querySelectorAll('dialog[open]').forEach(d=>d.close());if(game&&!game.state.done)paused=true;}
};
})();
