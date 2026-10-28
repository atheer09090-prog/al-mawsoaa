(() => {
'use strict';
const S=window.WorkshopShared,{esc,n}=S;
function mount(root,C){
 const K=window.OMANI_CRAFT_KNOWLEDGE[C.simple.kind];
 C={...C,facts:[...C.facts,...K.facts]};
 const D=C.simple,isHalwa=D.kind==='halwa',isFrank=D.kind==='frankincense',isAdded=['sadu','pottery','sandalwood'].includes(D.kind),titleId=D.titleId||(isHalwa?'workshopTitle':'frTitle'),other=D.other||(isHalwa?'frankincense':'halwa'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let game,active=false,paused=false,pointer=null,held=false,previousStage=-1,wasDone=false,notice='',photoKey='',drawKey='';
 const $=q=>root.querySelector(q.replace(/#(simple\w+)/g,(_,id)=>'#'+D.kind+'-'+id)),reduced=()=>motion.matches;
 const runtime=S.createLoop({canRun:()=>active&&game&&!paused&&!game.state.done,onStep:dt=>{if(held){const stage=game.state.stage;if(isHalwa)game.stir(dt*D.holdTurns);else game.work(dt*D.holdWork);if(game.state.stage!==stage||game.state.done)held=false;}game.tick(dt);},onDraw:draw,onUI:update});
 const announce=text=>{if(text!==notice){notice=text;$('#simpleLive').textContent=text;}};
 function init(){
  runtime.stop();game=window.SimpleCraftEngine.create(D);paused=false;pointer=null;held=false;previousStage=-1;wasDone=false;photoKey='';notice='';drawKey='';
  root.innerHTML=`<div class="sc-heading"><div><p class="eyebrow">ورشة الحِرف · جرّب بنفسك</p><h1 id="${titleId}" tabindex="-1">${esc(D.title)}</h1></div><button class="sc-source" type="button" data-sc-sources>عن التجربة والمصادر ↗</button></div><ol class="sc-steps" aria-label="ثلاث خطوات للتجربة">${D.steps.map((st,i)=>`<li data-sc-step="${i}"><span>${n(i+1)}</span>${esc(st.short)}</li>`).join('')}</ol><div class="sc-layout"><figure class="sc-figure"><div class="sc-scene ${isFrank?'sc-tree':'sc-pot'} sc-${D.kind}" id="simpleScene">${!isFrank?'<canvas id="simpleCanvas" width="640" height="640" tabindex="0" role="application" aria-label="'+esc(D.interactionLabel||'حرّك الحلوى في دوائر، أو اضغط المسافة للتحريك، أو استخدم زر التحريك.')+'"></canvas>':'<img id="simplePhoto" width="1024" height="766" alt="شجرة لبان حقيقية كاملة في ظفار"><button class="sc-tree-spot" id="simpleSpot" type="button" aria-label="انقش برفق داخل المحاكاة"><span aria-hidden="true">＋</span></button>'}<div class="sc-paused" id="simplePaused" hidden><button class="button button-primary" id="simpleResume" type="button">تابع التجربة</button></div></div><figcaption id="simpleCredit"></figcaption></figure><div class="sc-copy"><p class="sc-number" id="simpleNumber"></p><h2 id="simpleStepTitle" tabindex="-1"></h2><p class="sc-instruction" id="simpleInstruction"></p><section class="sc-knowledge" id="simpleKnowledge" aria-labelledby="${D.kind}-simpleKnowledgeTitle" hidden><p class="sc-knowledge-kicker">من الموسوعة العُمانية</p><h3 id="simpleKnowledgeTitle">حكاية الحِرفة</h3>${D.completionIds.map(id=>`<p>${esc(K.facts.find(f=>f.id===id).text)}</p>`).join('')}</section><div class="sc-progress" id="simpleProgressWrap" hidden><progress id="simpleProgress" max="100" value="0" aria-label="تقدّم الخطوة"></progress><span id="simpleProgressText"></span></div><button class="button button-primary sc-action" id="simpleAction" type="button"></button><p class="sc-note" id="simpleNote"></p><a class="sc-other" id="simpleOther" href="#workshop/${other}" hidden>جرّب ${esc(D.otherLabel||(isHalwa?'استخراج اللبان':'صناعة الحلوى'))} ←</a></div></div><p class="sc-safety">${esc(D.safety)}</p><div class="sr-only" id="simpleLive" aria-live="polite" aria-atomic="true"></div>`.replace(/id="(simple[^"]+)"/g,(_,id)=>'id="'+D.kind+'-'+id+'"');
  $('#simpleAction').onclick=()=>{if(paused)return;if(game.state.done){init();return;}game.act();update();};
  $('#simpleResume').onclick=()=>setPaused(false);
  if(isFrank)$('#simpleSpot').onclick=()=>{if(!paused){game.act();update();}};
  else bindInput();
  update();$('#'+titleId).focus({preventScroll:true});runtime.start();
 }
 function canWork(){return !paused&&!game.state.done&&!game.state.busy&&(game.state.stage===1||D.kind==='sadu'&&game.state.stage===2);}
 function bindInput(){
  const cv=$('#simpleCanvas');
  const point=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};
  cv.addEventListener('pointerdown',e=>{if(!canWork())return;const p=point(e);pointer={id:e.pointerId,angle:Math.atan2(p.y,p.x),...p};cv.setPointerCapture(e.pointerId);cv.focus({preventScroll:true});e.preventDefault();});
  cv.addEventListener('pointermove',e=>{
   if(!pointer||pointer.id!==e.pointerId||!canWork())return;const p=point(e),a=Math.atan2(p.y,p.x),d=Math.atan2(Math.sin(a-pointer.angle),Math.cos(a-pointer.angle));
   if(D.kind==='sandalwood')game.work(Math.abs(p.x-pointer.x)*2);
   else if(D.kind==='pottery')game.work(Math.max(0,pointer.y-p.y)*2.5);
   else if(D.kind==='sadu'&&game.state.stage===2)game.work((p.x-pointer.x)*1.7);
   else if(Math.hypot(p.x,p.y)>.06){if(isHalwa)game.stir(d/(Math.PI*2));else game.work(d/(Math.PI*2));}
   pointer={id:e.pointerId,angle:a,...p};update();
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])cv.addEventListener(type,()=>pointer=null);
  cv.addEventListener('keydown',e=>{if([' ','ArrowLeft','ArrowRight','ArrowUp'].includes(e.key)){e.preventDefault();if(!e.repeat&&canWork())held=true;}});
  for(const type of ['keyup','blur'])cv.addEventListener(type,()=>held=false);
 }
 function setPaused(value){
  if(!game||game.state.done)return;paused=value;held=false;pointer=null;$('#simplePaused').hidden=!value;$('#simpleAction').disabled=value||game.state.busy;if(isFrank)$('#simpleSpot').disabled=value||game.state.busy;
  if(value)runtime.stop();else runtime.start();
 }
 function credit(record){if(record.license==='رسم أصلي')return 'رسم توضيحي أصلي للمشروع';return `<a href="${esc(record.url)}" target="_blank" rel="noopener noreferrer">${esc(record.author)}</a> · <a href="${esc(record.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(record.license)}</a> · ${esc(record.changes||'تصغير دون قص')}`;}
 function update(){
  if(!game)return;const s=game.state,step=D.steps[s.stage],changed=previousStage!==s.stage;
  if(changed){previousStage=s.stage;held=false;pointer=null;root.querySelectorAll('[data-sc-step]').forEach((el,i)=>{if(i===s.stage)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.classList.toggle('is-done',i<s.stage);});}
  $('#simpleNumber').textContent=s.done?'اكتملت تجربتك':`الخطوة ${n(s.stage+1)} من ٣`;
  $('#simpleStepTitle').textContent=s.done?D.doneTitle:step.title;
  $('#simpleInstruction').textContent=s.done?D.doneText:isHalwa&&s.stage===1&&s.aromas?D.aromasText:step.text;
  $('#simpleAction').textContent=s.done?'جرّب مرة أخرى':s.busy?step.busy:step.action;
  $('#simpleAction').disabled=paused||s.busy;
  $('#simpleKnowledge').hidden=!s.done;
  if(!isFrank){const cv=$('#simpleCanvas');cv.setAttribute('role',s.done?'img':'application');cv.setAttribute('aria-label',s.done?(isHalwa?'صورة حقيقية لحلوى عُمانية مزيّنة بالمكسرات':'رسم توضيحي للقطعة المكتملة'):D.interactionLabel||'حرّك الحلوى في دوائر، أو استخدم المسافة أو زر التحريك.');}
  $('#simpleNote').textContent=s.done?D.doneNote:step.note||'';$('#simpleOther').hidden=!s.done;
  const progressing=!s.done&&(s.busy||(isHalwa||isAdded)&&s.stage===1||D.kind==='sadu'&&s.stage===2);
  $('#simpleProgressWrap').hidden=!progressing;$('#simpleProgress').value=s.progress*100;
  $('#simpleProgressText').textContent=isHalwa?(s.stage===1?'القوام يتماسك':'نسكب في الوعاء…'):isFrank?(s.busy?'تجفّ القطرات…':''):D.kind==='sadu'?(s.stage===1?'يتكوّن الخيط':'ينسج القماش'):D.kind==='sandalwood'?'تتجمّع خلاصة الصندل':s.busy?['يجفّ في الظل…','يُحرق في الفرن…','يُترك ليبرد…'][Math.min(2,Math.floor(s.progress*3))]:'يتشكّل الوعاء';
  if(isFrank){
   const record=s.done?D.media.resin:s.stage===0?D.media.tree:D.media.bark;
   if(photoKey!==record.src){photoKey=record.src;const img=$('#simplePhoto');img.src=record.src;img.width=record.width;img.height=record.height;img.alt=record.alt;$('#simpleCredit').innerHTML=credit(record);}
   $('#simpleSpot').hidden=s.done||s.stage===1;$('#simpleSpot').classList.toggle('is-collect',s.stage===2);$('#simpleSpot').setAttribute('aria-label',s.stage===2?'اجمع اللبان':'انقش برفق داخل المحاكاة');
  }else $('#simpleCredit').innerHTML=isHalwa&&s.done?credit(D.media.reference):'مشهد تفاعلي توضيحي';
  if(changed||s.done!==wasDone){announce(s.done?D.doneTitle:step.title+'؛ '+step.text);if(changed&&s.stage>0)$('#simpleStepTitle').focus({preventScroll:true});}
  if(s.done&&!wasDone){S.storage(D.completionKey).set({completed:true,date:new Date().toISOString()});runtime.stop();$('#simpleStepTitle').focus({preventScroll:true});announce(D.doneTitle+'؛ ظهرت بطاقة معلومات من الموسوعة العُمانية.');}
  wasDone=s.done;draw();
 }
 const reference=new Image();if(isHalwa){reference.src=D.media.reference.src;reference.onload=()=>{if(active&&game?.state.done)draw();};}
 function draw(){
  if(isFrank||!game)return;const cv=$('#simpleCanvas');if(!cv)return;const s=game.state;
  if(isAdded){const key=[s.stage,s.progress,s.angle,s.busy,s.done,reduced()].join(':');if(key!==drawKey){drawKey=key;window.WorkshopCraftDraw.draw(cv,D.kind,s,reduced());}return;}
  const x=cv.getContext('2d'),cx=320,cy=320,r=240;
  x.clearRect(0,0,640,640);x.fillStyle='#19342f';x.fillRect(0,0,640,640);
  if(s.done&&reference.complete&&reference.naturalWidth){const k=Math.min(640/reference.width,640/reference.height);x.drawImage(reference,(640-reference.width*k)/2,(640-reference.height*k)/2,reference.width*k,reference.height*k);return;}
  const metal=x.createLinearGradient(50,50,570,590);metal.addColorStop(0,'#f5d396');metal.addColorStop(.3,'#8c592d');metal.addColorStop(.6,'#d9ae6b');metal.addColorStop(1,'#76502e');
  x.shadowColor='#0008';x.shadowBlur=26;x.shadowOffsetY=12;x.fillStyle=metal;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();x.shadowBlur=0;x.shadowOffsetY=0;
  const progress=s.stage===0?0:s.stage===1?s.progress:1,colours=C.tuning.colours;
  const blend=(a,b,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');
  const mix=x.createRadialGradient(260,240,10,cx,cy,r);mix.addColorStop(0,s.stage===0?'#4a5140':blend(colours.pale[0],colours.amber[0],progress));mix.addColorStop(1,s.stage===0?'#202b23':blend(colours.pale[1],colours.amber[1],progress));
  x.fillStyle=mix;x.beginPath();x.arc(cx,cy,r-22,0,Math.PI*2);x.fill();
  if(s.stage>0){x.save();x.translate(cx,cy);x.rotate(reduced()?0:s.angle*.1);for(let i=0;i<6;i++){x.strokeStyle='rgba(255,224,161,.1)';x.lineWidth=2+progress*3;x.beginPath();x.ellipse(0,0,40+i*25,22+i*25,-.2,0,Math.PI*1.8);x.stroke();}x.restore();}
  if(s.aromas)for(let i=0;i<16;i++){x.save();x.translate(180+(i*83)%280,180+(i*59)%280);x.rotate(i*2.3);x.fillStyle='#d8b98c';x.beginPath();x.ellipse(0,0,7,3,0,0,Math.PI*2);x.fill();x.restore();}
  if(s.stage<2){x.save();x.translate(cx,cy);x.rotate(reduced()?-.5:s.angle-.5);const paddle=x.createLinearGradient(-12,0,12,0);paddle.addColorStop(0,'#936035');paddle.addColorStop(.45,'#e3b776');paddle.addColorStop(1,'#9f6b3b');x.fillStyle=paddle;x.beginPath();x.roundRect(-12,-300,24,310,8);x.fill();x.beginPath();x.ellipse(0,38,30,60,0,0,Math.PI*2);x.fill();x.restore();}
  else if(s.busy){x.fillStyle='#e7ddc3';x.beginPath();x.ellipse(320,320,185,152,0,0,Math.PI*2);x.fill();x.fillStyle=colours.amber[0];x.beginPath();x.ellipse(320,320,170*s.progress,136*s.progress,0,0,Math.PI*2);x.fill();}
 }
 root.addEventListener('click',e=>{if(!e.target.closest('[data-sc-sources]'))return;const before=paused;S.sources({root,config:{...C,facts:C.facts.filter(f=>D.sourceIds.includes(f.id))},compact:true,credit:isAdded?'<figure class="sc-reference"><img src="'+esc(D.media.reference.src)+'" width="'+D.media.reference.width+'" height="'+D.media.reference.height+'" alt="'+esc(D.media.reference.alt)+'" loading="lazy"><figcaption>'+esc(D.media.reference.caption)+'</figcaption></figure>'+credit(D.media.reference):isHalwa?credit(D.media.reference):Object.values(D.media).map(credit).join('<br>'),pause:()=>setPaused(true),resume:()=>{if(active&&!document.hidden&&!before)setPaused(false);}});});
 document.addEventListener('visibilitychange',()=>{if(active&&document.hidden)setPaused(true);});window.addEventListener('blur',()=>{held=false;pointer=null;});motion.addEventListener('change',()=>{if(active)draw();});
 return {enter(){active=true;if(!game)init();else{if(!game.state.done)setPaused(false);$('#'+titleId)?.focus({preventScroll:true});}},leave(){active=false;runtime.stop();held=false;pointer=null;root.querySelectorAll('dialog[open]').forEach(d=>d.close());if(game&&!game.state.done)setPaused(true);}};
}
window.WorkshopSimple={mount};
})();
