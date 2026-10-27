/* محرك حتمي قابل للفحص. الأرقام معاملات لعبة معلنة، وليست إرشادات نقش. */
(() => {
'use strict';
const arab=v=>String(v).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function create(C,mode='learn'){
 const T=C.tuning;
 const s={mode,stage:0,tree:null,treeAge:null,treeHealth:0,barkCondition:0,incisionDepth:T.initialDepth,incisionAngle:T.initialAngle,incisionHeight:T.initialHeight,incisionSpacing:1,incisionCount:0,
  resinFlow:0,resinHardness:0,contamination:0,seasonDay:0,cumulativeStress:0,temperature:'معتدلة افتراضيًا',humidity:'ثابتة في النموذج',elapsed:0,round:1,roundDay:0,prepared:0,scars:T.oldScars.map(p=>({...p})),wounds:[],batch:[],harvest:[],stored:false,incense:0,done:false,penalty:0,log:[],errors:[]};
 function log(label,kind='action'){if(s.log.length<T.maxLog)s.log.push({stage:s.stage,day:s.seasonDay,at:s.elapsed,label:arab(label),kind});}
 function warning(key,label,fact){if(s.errors.some(e=>e.key===key))return;s.errors.push({key,label,fact});log(label,'error');}
 function select(id){if(s.stage!==0)return false;const tree=C.trees.find(t=>t.id===id);if(!tree)return false;s.tree={...tree};s.treeAge=tree.treeAge;s.treeHealth=tree.treeHealth;s.barkCondition=tree.barkCondition;log('اختيار '+tree.name);return true;}
 function prepare(amount){if(s.stage!==1||!Number.isFinite(amount))return;s.prepared=clamp(s.prepared+Math.abs(amount)/T.prepareMotion);}
 function set(key,value){if(s.done||!['incisionDepth','incisionAngle','incisionHeight'].includes(key))return;const v=Number(value);if(!Number.isFinite(v))return;s[key]=clamp(v,0,key==='incisionAngle'?90:100);}
 function cut(x,y,motion){
  if(s.stage!==2||!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(motion)||motion<T.cutMotion||s.wounds.length>=T.maxCuts)return false;
  x=clamp(x,.22,.78);y=clamp(y,.15,.88);const points=[...s.scars,...s.wounds];
  const spacing=Math.min(...points.map(w=>Math.hypot(w.x-x,w.y-y)));s.incisionSpacing=spacing;
  const shallow=s.incisionDepth<T.shallow,deep=s.incisionDepth>T.deep,close=spacing<T.spacing,extra=s.wounds.length>=T.safeCuts;
  let damage=T.baseStress+(deep?T.deepDamage:0)+(close?T.closeDamage:0)+(extra?T.extraDamage:0);
  if(s.treeAge==='صغيرة')damage*=2;
  const vigor=s.treeHealth/100*(s.treeAge==='صغيرة'?T.youngMultiplier:1)*(s.treeHealth<60?T.weakMultiplier:1);
  const flow=T.yieldPerCut*vigor*(shallow?T.shallowYield:deep?T.deepYield:1);
  s.treeHealth=clamp(s.treeHealth-damage,0,100);s.cumulativeStress+=damage;s.incisionCount++;
  s.wounds.push({x,y,depth:s.incisionDepth,angle:s.incisionAngle,flow,collection:0});s.resinFlow+=flow;
  log('نقش جديد؛ العمق الرمزي '+Math.round(s.incisionDepth)+' من ١٠٠');
  if(deep)warning('deep','شق عميق في النموذج؛ تضررت الشجرة ولا يمحو الانتظار هذا الضرر.','cut');
  if(close)warning('close','اقتربت من ندبة أو شق سابق؛ زاد إجهاد الشجرة في النموذج.','cut');
  if(extra)warning('extra','كثّفت النقش؛ زاد إجهاد الشجرة.','rest');
  if(shallow)warning('shallow','كان الشق سطحيًا جدًا في النموذج؛ النز ضعيف.','cut');
  if(s.treeAge==='صغيرة'||s.tree.treeHealth<60)warning('weak','نقشت شجرة صغيرة أو ضعيفة؛ كانت الراحة خيارًا أرفق.','tree');
  return true;
 }
 function advanceDays(days){
  if(s.stage!==3||!Number.isFinite(days))return;
  const d=clamp(days,0,T.maxDay-s.roundDay);s.roundDay+=d;s.seasonDay+=d;
  s.resinHardness=clamp(s.roundDay/T.waitDays);s.contamination=clamp(Math.max(0,s.roundDay-T.lateDays)*T.lateDust);
 }
 function collect(index,amount){
  if(s.stage!==4)return false;const w=s.wounds[index];if(!w||w.collection>=1||!Number.isFinite(amount))return false;
  w.collection=clamp(w.collection+Math.abs(amount)/T.collectMotion);
  if(w.collection>=1){
   const early=s.resinHardness<1,quality=(early?T.earlyLoss:1)*(1-s.contamination);
   const pieces=Math.floor(w.flow*quality);
   for(let i=0;i<pieces;i++)s.batch.push({id:s.round+'-'+index+'-'+i,size:i%2?'small':'large',dirty:i%3===2||s.contamination>.1,sorted:null,origin:s.tree.origin});
   if(early)warning('early','جمعت القطرات قبل اكتمال التصلب في النموذج؛ التصق جزء منها وفقدت محصولًا.','wait');
   if(s.contamination>0)warning('late','تأخرت في الجمع في النموذج؛ زادت شوائب الدفعة.','collect');
   log('جمع موضع نقش؛ '+pieces+' حبات رمزية');
  }return true;
 }
 function sieve(amount){if(s.stage!==5||!Number.isFinite(amount))return;s.sieving=clamp((s.sieving||0)+Math.abs(amount)/T.sieveMotion);if(s.sieving>=1){s.batch.forEach(b=>{if(!b.sorted)b.dirty=false;});s.contamination=0;}}
 function sort(id,bin){
  if(s.stage!==5||!['large','small','dirty'].includes(bin))return false;const b=s.batch.find(b=>b.id===id);if(!b||b.sorted)return false;
  const correct=b.dirty?'dirty':b.size;b.sorted=bin;
  if(bin!==correct){s.penalty+=T.sortPenalty;warning('sort','اختلطت أحجام أو شوائب في أوعية الفرز؛ سجّل النموذج قرارك.','grades');}
  log('فرز حبة إلى '+({large:'الكبير النظيف',small:'الصغير النظيف',dirty:'ما يحتاج تنظيفًا'}[bin]));return true;
 }
 function store(){if(s.stage!==6||s.stored)return false;s.stored=true;s.harvest.push(...s.batch.map(b=>({...b})));log('تعبئة الدفعة مع بقاء أصلها '+s.tree.origin);return true;}
 function repeat(){if(s.stage!==6||!s.stored||s.round>=T.maxRounds)return false;s.round++;s.stage=1;s.prepared=0;s.scars.push(...s.wounds.map(w=>({x:w.x,y:w.y})));s.wounds=[];s.batch=[];s.roundDay=0;s.resinHardness=0;s.resinFlow=0;s.contamination=0;s.sieving=0;s.stored=false;s.cumulativeStress+=T.repeatStress;s.treeHealth=clamp(s.treeHealth-T.repeatStress,0,100);log('جولة تمثيلية جديدة؛ الإجهاد السابق باقٍ');return true;}
 function burn(){if(s.stage!==7)return;s.incense=1;log(s.harvest.length?'وضع حبة على المبخرة الافتراضية':'عرض أثر حبة مرجعية؛ لم تُنتج المحاولة حبات');}
 function tick(dt){if(s.done)return;s.elapsed+=dt;}
 function ready(){return [!!s.tree,s.prepared>=1,s.wounds.length>0,s.roundDay>=1,s.wounds.every(w=>w.collection>=1),s.batch.every(b=>b.sorted),s.stored,s.incense>=1,false][s.stage];}
 function next(){if(!ready()||s.done)return false;log('إتمام '+C.stages[s.stage].title,'stage');s.stage++;if(s.stage===8)s.done=true;return true;}
 function result(){
  const bins={large:0,small:0,dirty:0};for(const b of s.harvest)bins[b.sorted]++;
  const care=clamp(1-s.cumulativeStress/100),sorting=clamp(1-s.penalty/100),sustainability=Math.round(s.treeHealth*T.healthWeight+care*100*T.careWeight+sorting*100*T.sortingWeight);
  return {score:sustainability,sustainability,health:Math.round(s.treeHealth),amount:s.harvest.length,bins,origin:s.tree?.origin||'',rounds:s.round,stress:Math.round(s.cumulativeStress),mode:s.mode};
 }
 return {state:s,select,prepare,set,cut,advanceDays,collect,sieve,sort,store,repeat,burn,tick,ready,next,result,log};
}
window.FrankincenseEngine={create,clamp};
})();
