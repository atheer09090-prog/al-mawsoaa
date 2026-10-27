/* محرك مستقل عن DOM: كل معاملات التجربة في data/halwa.js. */
(() => {
'use strict';
const arab=v=>String(v).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function create(config,mode='learn'){
 const t=config.tuning;
 const s={mode,stage:0,heat:0,temperature:0,stirRate:0,regularity:1,starchDissolved:0,consistency:0,color:0,sticking:0,burn:0,gheeIntegration:0,
  selected:[],added:{},slurryWater:false,slurryStarch:false,slurryAdded:false,sugarDissolved:0,ghee:0,aromas:false,nuts:false,lumps:0,
  elapsed:0,virtual:0,idle:0,lastInputAt:null,previousInputRate:0,wasMoving:false,maxIdle:0,angle:0,poured:0,levelled:0,cooled:0,penalty:0,errors:[],log:[],visits:[0],done:false};
 const log=(label,kind='action')=>{if(s.log.length<t.maxLog)s.log.push({at:s.elapsed,stage:s.stage,label,kind});};
 function error(key,message,fact){
  if(s.errors.some(e=>e.key===key))return;
  const points=t.penalty[key]||0;s.penalty+=points;
  s.errors.push({key,message,fact,at:s.elapsed});log(message,'error');
 }
 const stage=()=>config.stages[s.stage];
 function setHeat(n){n=Math.round(clamp(Number(n),0,t.heatTargets.length-1));if(n!==s.heat){s.heat=n;log(`ضبط النار: ${arab(n)}`);}}
 function stir(turns){
  const amount=Math.min(Math.abs(turns),t.stirInputCap);if(!amount)return;
  s.stirRate=clamp(s.stirRate+amount*t.stirGain,0,t.stirMax);s.idle=0;
  s.angle+=turns*Math.PI*2/(1+s.consistency*t.thickResistance);
  if(s.lastInputAt!==null){const rate=amount/Math.max(t.step,s.elapsed-s.lastInputAt);const evenness=1-Math.abs(rate-s.previousInputRate)/Math.max(rate,s.previousInputRate,t.step);s.regularity=clamp(s.regularity*(1-t.regularitySmoothing)+evenness*t.regularitySmoothing);s.previousInputRate=rate;}else s.previousInputRate=amount/t.step;
  s.lastInputAt=s.elapsed;
 }
 function add(id){
  const item=config.ingredients.find(x=>x.id===id);if(!item)return false;
  if(s.stage===0){
   if(item.distractor){error('distractor','اخترت عنصرًا خارج مكونات هذه التجربة.','ingredients');return false;}
   if(!s.selected.includes(id)){s.selected.push(id);log(`اختيار ${item.name}`);}return true;
  }
  if(s.stage===1){
   if(id==='water'&&!s.slurryWater){s.slurryWater=true;log('إضافة الماء إلى وعاء النشا');return true;}
   if(id==='starch'&&!s.slurryStarch){s.slurryStarch=true;log('إضافة النشا إلى وعاء التحضير');return true;}
   return false;
  }
  if(s.stage<2||s.stage>5||item.distractor)return false;
  if(id==='water'&&!s.added.water){s.added.water=true;s.temperature=Math.max(0,s.temperature-t.coldDrop);log('إضافة الماء إلى القدر');return true;}
  if(id==='sugar'&&!s.added.sugar){
   if(!s.added.water||s.temperature<t.boil){error('order','أضفت السكر قبل غليان الماء في هذه التجربة.','syrup');}
   s.added.sugar=true;log('إضافة السكر');return true;
  }
  if(id==='starch'&&!s.slurryAdded){
   if(!s.added.sugar||s.sugarDissolved<t.readyThreshold)error('order','تغيّر ترتيب إضافات الخليط في تجربتك.','syrup');
   s.slurryAdded=true;
   if(s.starchDissolved<t.readyThreshold){s.lumps=1-s.starchDissolved;error('unmixedStarch','دخل النشا قبل اكتمال تحضير المعلق؛ ظهرت تكتلات.','lumps');}
   s.temperature=Math.max(0,s.temperature-t.coldDrop);log('إضافة معلق النشا');return true;
  }
  if(id==='ghee'&&s.ghee<1){
   if(s.consistency<t.gel)error('order','أضفت السمن قبل القوام الهلامي في نموذج التجربة.','ghee');
   s.ghee=clamp(s.ghee+t.gheePortion);s.temperature=Math.max(0,s.temperature-t.coldDrop*t.gheePortion);log('إضافة جزء من السمن');return true;
  }
  if(id==='aromas'&&!s.aromas){
   if(s.ghee<1)error('earlyAroma','أضفت النكهات قبل السمن؛ خالفت ترتيب الإعداد المعروض.','ghee');
   s.aromas=true;log('إضافة ماء الورد والزعفران والهيل');return true;
  }
  if(id==='nuts'&&!s.nuts){s.nuts=true;log('إضافة المكسرات');return true;}
  return false;
 }
 function tick(dt,speed=1){
  if(s.done)return;
  s.elapsed+=dt;s.virtual+=dt*speed;
  s.stirRate=Math.max(0,s.stirRate-dt*t.stirDecay);
  const moving=s.stirRate>=t.stirMin;
  if(!moving){s.idle+=dt;if(s.stage>=1&&s.stage<=5)s.regularity=Math.max(0,s.regularity-dt*t.regularityDecay);}else s.idle=0;
  if(moving!==s.wasMoving&&s.stage>=1&&s.stage<=5){log(moving?'بدأ التحريك':'توقف التحريك','stir');s.wasMoving=moving;}
  if(s.stage>=2&&s.stage<=5){
   s.temperature+=(t.heatTargets[s.heat]-s.temperature)*Math.min(1,dt*speed*t.heatResponse);
   if(s.heat>0&&s.slurryAdded)s.maxIdle=Math.max(s.maxIdle,s.idle);
   if(s.added.sugar&&s.added.water&&moving&&s.temperature>=t.boil)s.sugarDissolved=clamp(s.sugarDissolved+dt*speed*t.sugarRate);
   if(s.slurryAdded&&s.temperature>=t.minimumHeat&&s.sugarDissolved>=t.readyThreshold){
    const heat=clamp((s.temperature-t.minimumHeat)/(t.heatTargets[2]-t.minimumHeat));
    const cap=s.stage<4?t.gel+t.gelOvershoot:s.stage===4?t.done-t.enrichCapOffset:1;
    s.consistency=Math.min(cap,s.consistency+dt*speed*t.consistencyRate*heat*(moving?1:t.inactiveCooking));
    s.color=clamp(s.consistency*t.colourProgress+s.burn*t.colourBurn);
    if(moving)s.gheeIntegration=clamp(s.gheeIntegration+dt*speed*t.gheeRate,0,s.ghee);
    if(s.idle>t.stickAfter||s.temperature>t.hot)s.sticking=clamp(s.sticking+dt*speed*t.stickRate*(moving?t.hotMovingStick:1));
    else if(moving&&s.heat<3&&s.burn===0)s.sticking=Math.max(0,s.sticking-dt*speed*t.rescueRate);
    if(s.sticking>t.burnStart&&(s.idle>t.burnAfter||s.temperature>t.hot))s.burn=clamp(s.burn+dt*speed*t.burnRate);
    if(s.sticking>t.stickWarning)error('sticking','بدأ الخليط يلتصق في المحاكاة؛ خفّض النار وواصل التحريك.','gel');
    if(s.burn>t.burnWarning)error('scorched',`ظهر احتراق في النموذج؛ أطول توقف عن التحريك ${arab(Math.round(s.maxIdle))} ثانية.`,'burn');
   }
  }
  if(s.stage===1&&s.slurryWater&&s.slurryStarch&&moving)s.starchDissolved=clamp(s.starchDissolved+dt*speed*t.slurryRate);
  if(s.stage===6){s.temperature=Math.max(0,s.temperature-dt*speed*t.coolingResponse*s.temperature);if(s.poured>=t.readyThreshold&&s.levelled>=t.readyThreshold)s.cooled=clamp(s.cooled+dt*speed*t.coolRate);}
 }
 function ready(){
  switch(s.stage){
   case 0:return config.ingredients.filter(i=>!i.distractor).every(i=>s.selected.includes(i.id));
   case 1:return s.slurryWater&&s.slurryStarch&&s.starchDissolved>=t.readyThreshold;
   case 2:return s.added.water&&s.added.sugar&&s.sugarDissolved>=t.readyThreshold;
   case 3:return s.slurryAdded&&s.consistency>=t.gel;
   case 4:return s.ghee>=1&&s.gheeIntegration>=t.readyThreshold&&s.aromas&&s.nuts;
   case 5:return s.heat===0; // القرار متاح حتى لو لم ينضج القوام: تظهر النتيجة الفعلية.
   case 6:return s.cooled>=t.readyThreshold;
   default:return false;
  }
 }
 function next(force=false){
  if(!ready()&&!(force&&s.stage===1))return false;
  log('إتمام '+stage().title,'stage');
  if(s.stage===5){
   if(s.consistency<t.done)error('under','رفعت القدر قبل وصول مؤشر القوام إلى المجال المطلوب في التجربة.','finish');
   if(s.consistency>=t.overdone)error('over','تركت القوام حتى تجاوز المجال المطلوب في التجربة.','finish');
   s.heat=0;
  }
  if(s.stage===6)s.done=true;
  s.stage++;s.visits.push(s.elapsed);s.stirRate=0;s.idle=0;
  return true;
 }
 function pour(dt){if(s.stage===6){if(s.poured<t.readyThreshold)s.poured=clamp(s.poured+dt*t.pourRate);else s.levelled=clamp(s.levelled+dt*t.levelRate);}}
 function result(){
  const score=Math.round(clamp(1-s.penalty/100-s.burn*t.scoreBurn-s.lumps*t.scoreLumps)*100);
  return {score,stars:Math.max(1,Math.min(5,Math.ceil(score/20))),mode:s.mode,elapsed:s.elapsed,
   reasons:s.errors.map(x=>x.message),maxIdle:s.maxIdle,regularity:Math.round(s.regularity*100)};
 }
 return {state:s,stage,add,setHeat,stir,tick,ready,next,pour,result,log};
}
window.HalwaEngine={create,clamp};
})();
