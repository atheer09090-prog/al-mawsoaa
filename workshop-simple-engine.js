/* تجربة موجّهة بثلاث خطوات. زمن الحركة للعرض فقط، وليس زمن تصنيع أو حصاد. */
(() => {
'use strict';
function create(config){
 const s={stage:0,progress:0,busy:false,done:false,angle:0,elapsed:0,aromas:false};
 const clamp=v=>Math.max(0,Math.min(1,v));
 function act(){
  if(s.done||s.busy)return false;
  if(['sadu','pottery','sandalwood'].includes(config.kind)){
   if(s.stage===0){s.stage=1;s.progress=0;}
   else if(s.stage===1||config.kind==='sadu')work(config.tapWork);
   else if(config.kind==='sandalwood'){s.done=true;s.progress=1;}
   else{s.busy=true;s.progress=0;}
  }else if(config.kind==='halwa'){
   if(s.stage===0){s.stage=1;s.progress=0;}
   else if(s.stage===1)stir(config.tapTurn);
   else{s.busy=true;s.progress=0;}
  }else if(s.stage===0){s.stage=1;s.progress=0;}
  else if(s.stage===1){s.busy=true;s.progress=0;}
  else{s.done=true;s.progress=1;}
  return true;
 }
 function stir(turns){
  if(config.kind!=='halwa'||s.stage!==1||s.done||!Number.isFinite(turns))return;
  const amount=Math.min(Math.abs(turns),config.maxTurn);s.angle+=amount*Math.PI*2;
  s.progress=clamp(s.progress+amount/config.stirTurns);
  if(s.progress>=config.aromasAt)s.aromas=true;
  if(s.progress===1){s.stage=2;s.progress=0;}
 }
 function work(amount){
  if(!['sadu','pottery','sandalwood'].includes(config.kind)||s.done||s.busy||!Number.isFinite(amount)||s.stage===0||config.kind!=='sadu'&&s.stage!==1)return;
  const effort=Math.min(Math.abs(amount),.25);s.progress=clamp(s.progress+effort);s.angle+=effort*Math.PI*4;
  if(s.progress===1){if(s.stage===1){s.stage=2;s.progress=0;}else s.done=true;}
 }
 function tick(dt){
  if(s.done||!Number.isFinite(dt)||dt<=0)return;s.elapsed+=dt;
  if(!s.busy)return;s.progress=clamp(s.progress+dt/config.transitionSeconds);
  if(s.progress===1){s.busy=false;if(config.kind==='halwa'||config.kind==='pottery')s.done=true;else{s.stage=2;s.progress=0;}}
 }
 return {state:s,act,stir,work,tick};
}
window.SimpleCraftEngine={create};
})();
