import assert from 'node:assert/strict';
import {readFile,stat,readdir} from 'node:fs/promises';
import vm from 'node:vm';
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
const c={window:{}};
for(const f of ['data/halwa.js','halwa-engine.js'])vm.runInNewContext(await read(f),c,{filename:f});
const C=c.window.OMANI_HALWA,E=c.window.HalwaEngine,T=C.tuning;
function sourceRequired(f){
 assert(f.id&&f.text&&f.stage&&f.source,'Fact missing source');
 const s=f.source;assert(['encyclopedia','supporting','field'].includes(s.kind));
 assert(s.entryTitle&&s.note,'Missing source identity or limitation');
 assert(s.volume===null||typeof s.volume==='string'||Number.isInteger(s.volume));
 assert(s.page===null||typeof s.page==='string'||Number.isInteger(s.page));
 if(s.kind==='supporting')assert.equal(new URL(s.url).protocol,'https:');
 if(s.kind==='field')assert(s.name&&s.date&&s.consent,'Field interview requires consent, date and name');
}
assert.throws(()=>sourceRequired({id:'bad',text:'بلا مصدر',stage:'test'}));
for(const f of C.facts)sourceRequired(f);
assert.equal(new Set(C.facts.map(f=>f.id)).size,C.facts.length);
for(const st of C.stages)assert(C.facts.some(f=>f.id===st.fact));
for(const i of C.ingredients)assert(C.facts.some(f=>f.id===i.fact));
const tick=(g,seconds,moving=true,speed=1)=>{for(let n=0;n<Math.round(seconds/T.step);n++){if(moving)g.stir(T.step*.65);g.tick(T.step,speed);}};
function toCook(unmixed=false){
 const g=E.create(C);for(const i of C.ingredients.filter(i=>!i.distractor))g.add(i.id);assert(g.next());
 g.add('water');g.add('starch');if(!unmixed)tick(g,9);assert(g.next(unmixed));
 g.add('water');g.setHeat(2);tick(g,10);assert(g.state.temperature>=T.boil);g.add('sugar');tick(g,9);assert(g.next());g.add('starch');return g;
}
const good=toCook();tick(good,18);assert(good.ready());assert(good.next());for(let i=0;i<4;i++)good.add('ghee');tick(good,10);good.add('aromas');good.add('nuts');assert(good.next());tick(good,6);good.setHeat(0);assert(good.next());
for(let n=0;n<500;n++){good.pour(T.step);good.tick(T.step);}tick(good,9,false);assert(good.next());assert(good.state.done);assert.equal(good.result().score,100,'Successful path must be achievable');
const burned=toCook();burned.setHeat(3);tick(burned,35,false);assert(burned.state.burn>.25);assert(burned.result().score<good.result().score);assert(burned.state.maxIdle>=30);
const burntBefore=burned.state.burn;burned.setHeat(1);tick(burned,20);assert(burned.state.burn>=burntBefore,'Burn is not magically reversible');
const lumpy=toCook(true);assert(lumpy.state.lumps>0);assert(lumpy.state.errors.some(e=>e.key==='unmixedStarch'));
const early=toCook();early.add('aromas');assert(early.state.errors.some(e=>e.key==='earlyAroma'));
const weak=toCook();weak.setHeat(0);tick(weak,45);assert(weak.state.consistency<T.gel,'No heat must not complete cooking');
const still=E.create(C);tick(still,5,false);assert.equal(still.state.starchDissolved,0);assert.equal(still.state.stirRate,0,'No automatic stirring');
const faster=E.create(C);tick(faster,3,false,2);assert(Math.abs(faster.state.elapsed-3)<.01);assert(Math.abs(faster.state.virtual-6)<.01);
const html=await read('index.html'),app=await read('app.js'),js=await read('workshop.js'),css=await read('workshop.css');
for(const f of ['workshop.js','halwa-engine.js','data/halwa.js','data/halwa-media.js'])new vm.Script(await read(f),{filename:f});
assert(html.includes('data-page="workshop"'));assert(app.includes("page === 'workshop'"));assert(app.includes("['play','practice'].includes(s.id)"));assert(app.includes("hash:'workshop/halwa'"));assert(app.includes("hash:'workshop/frankincense'"));assert(app.includes('href="#workshop">ورشة الحِرف'));
assert(!html.includes('<script src="workshop.js'),'Workshop must remain lazy');assert(!html.includes('<link rel="stylesheet" href="workshop.css'),'Workshop CSS must remain lazy');
const shared=await read('workshop-shared.js'),simpleUI=await read('workshop-simple.js'),simpleCSS=await read('workshop-simple.css');
assert(simpleUI.includes('visibilitychange')&&simpleUI.includes('S.createLoop')&&shared.includes('while(acc>=step)')&&shared.includes('document.hidden'));
assert(shared.includes('try{return JSON.parse(localStorage')&&simpleUI.includes('aria-live="polite"'));
assert(simpleUI.includes('S.sources')&&simpleUI.includes('compact:true'));assert(simpleCSS.includes('prefers-reduced-motion:reduce'));
assert(!simpleUI.includes('wsHeat')&&!simpleUI.includes('frDepth')&&!simpleUI.includes('ws-modes'),'Keep the guided interface simple');
assert(js.includes('WorkshopSimple.mount'));assert(!simpleUI.includes('new Audio('));
const credit=JSON.parse(await read('data/halwa-image-credits.json'));assert.equal(credit.license,'CC BY-SA 4.0');assert(credit.author&&credit.url&&credit.changes);
for(const name of await readdir(new URL('../assets/images/workshop/halwa/',import.meta.url))){
 const file=new URL('../assets/images/workshop/halwa/'+name,import.meta.url);assert((await stat(file)).size<=153600,'Image budget exceeded');
 assert.equal((await readFile(file)).toString('ascii',8,12),'WEBP');
}
for(const name of ['workshop.js','workshop.css','workshop-simple.js','workshop-simple.css','workshop-simple-engine.js','workshop-craft-draw.js','textile-pottery.js','data/textile-pottery.js','data/textile-pottery-image-credits.json','data/simple-crafts.js','workshop-shared.js','halwa-engine.js','data/halwa.js','data/halwa-media.js','data/halwa-image-credits.json','frankincense.js','frankincense.css','frankincense-engine.js','data/frankincense.js','data/frankincense-media.js','data/frankincense-image-credits.json'])assert((await readFile(new URL('../'+name,import.meta.url))).equals(await readFile(new URL('../dist/'+name,import.meta.url))),'dist mismatch: '+name);
console.log(`PASS: ${C.facts.length} sourced facts; successful session, burning, irreversible burn, unmixed starch, order, weak heat, real input, time ratio, lazy routes, image license and dist.`);
console.log('LIMITS: temperatures, quantities and stage times are game units; encyclopedia and field calibration pending.');

// A second craft must share infrastructure and preserve the complete first engine.
for(const f of ['data/frankincense.js','frankincense-engine.js','frankincense.js','workshop-shared.js'])new vm.Script(await read(f),{filename:f});
for(const f of ['data/frankincense.js','frankincense-engine.js'])vm.runInNewContext(await read(f),c,{filename:f});
const F=c.window.OMANI_FRANKINCENSE,FE=c.window.FrankincenseEngine,FT=F.tuning;
for(const f of F.facts)sourceRequired(f);
for(const st of F.stages)assert(F.facts.some(f=>f.id===st.fact));
const begin=(id='east',depth=40,x=.57,y=.57)=>{const g=FE.create(F);assert(g.select(id));assert(g.next());g.prepare(FT.prepareMotion);assert(g.next());g.set('incisionDepth',depth);assert(g.cut(x,y,FT.cutMotion));return g;};
const harvest=(g,days=14)=>{assert(g.next());g.advanceDays(days);assert(g.next());g.state.wounds.forEach((w,i)=>g.collect(i,FT.collectMotion));assert(g.next());g.sieve(FT.sieveMotion);for(const b of g.state.batch)g.sort(b.id,b.size);assert(g.next());g.store();};
const healthy=begin();harvest(healthy);assert(healthy.next());healthy.burn();assert(healthy.next());assert(healthy.state.done);assert(healthy.result().score>=95);assert(healthy.result().amount>0);
const deep=begin('east',95);const harmed=deep.state.treeHealth;harvest(deep);assert(deep.state.treeHealth===harmed,'Waiting must not magically heal an incision');assert(deep.result().score<healthy.result().score);
const shallow=begin('east',5);assert(shallow.state.resinFlow<healthy.state.resinFlow);
const earlyHarvest=begin();harvest(earlyHarvest,1);assert(earlyHarvest.result().amount<healthy.result().amount);assert(earlyHarvest.state.errors.some(e=>e.key==='early'));
const lateHarvest=begin();harvest(lateHarvest,35);assert(lateHarvest.state.errors.some(e=>e.key==='late'));
const young=begin('plain');assert(young.state.treeHealth<young.state.tree.treeHealth);assert(young.state.resinFlow<healthy.state.resinFlow);
const close=begin('east',40,.38,.36);assert(close.state.errors.some(e=>e.key==='close'));
const excess=begin();for(let i=0;i<FT.maxCuts;i++)excess.cut(.25+i*.06,.7,FT.cutMotion);assert(excess.state.errors.some(e=>e.key==='extra'));assert(excess.state.wounds.length===FT.maxCuts);assert(excess.state.treeHealth<healthy.state.treeHealth);
const repeat=begin();harvest(repeat);const oldHealth=repeat.state.treeHealth;assert(repeat.repeat());assert(repeat.state.treeHealth<oldHealth);assert(repeat.state.scars.length>FT.oldScars.length);assert(repeat.state.harvest.length>0);
const badSort=begin();assert(badSort.next());badSort.advanceDays(14);assert(badSort.next());badSort.collect(0,FT.collectMotion);assert(badSort.next());for(const b of badSort.state.batch)badSort.sort(b.id,'dirty');assert(badSort.state.penalty>0);
const angle=begin();angle.set('incisionAngle',45);angle.set('incisionHeight',70);assert.equal(angle.state.incisionAngle,45);assert.equal(angle.state.incisionHeight,70);
const before=angle.state.wounds.length;assert(!angle.cut(.5,.5,0));assert(!angle.cut(NaN,.5,1));assert.equal(angle.state.wounds.length,before);
// Test the shared scheduler itself: fixed steps, capped deltas, stop and hidden guards.
let pending=new Map(),nowId=0,ticks=0;const ctx={window:{},document:{hidden:false},Intl,requestAnimationFrame:fn=>{pending.set(++nowId,fn);return nowId;},cancelAnimationFrame:id=>pending.delete(id)};
vm.runInNewContext(shared,ctx);const loop=ctx.window.WorkshopShared.createLoop({step:.01,maxFrame:.1,canRun:()=>true,onStep:()=>ticks++,onDraw:()=>{},onUI:()=>{}});
const frame=t=>{const entry=pending.entries().next().value;assert(entry);pending.delete(entry[0]);entry[1](t);};loop.start();frame(1);frame(51);assert(ticks>=4&&ticks<=5);ctx.document.hidden=true;frame(101);assert.equal(pending.size,0);loop.start();assert.equal(pending.size,0);ctx.document.hidden=false;loop.start();loop.stop();assert.equal(pending.size,0);
const blocked={window:{},localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},Intl};vm.runInNewContext(shared,blocked);assert.equal(blocked.window.WorkshopShared.storage('test').get(),null);assert.equal(blocked.window.WorkshopShared.storage('test').set({score:100}),false);
assert((await read('frankincense.js')).includes('WorkshopSimple.mount'));assert(simpleUI.includes('prefers-reduced-motion')&&simpleUI.includes('reduced()'));
const frankCredits=JSON.parse(await read('data/frankincense-image-credits.json'));for(const file of await readdir(new URL('../assets/images/workshop/frankincense/',import.meta.url))){assert(frankCredits.some(c=>c.file===file&&c.author&&c.license&&c.url));const data=await readFile(new URL('../assets/images/workshop/frankincense/'+file,import.meta.url));assert(data.length<=153600);assert.equal(data.toString('ascii',8,12),'WEBP');}
console.log(`PASS: frankincense ${F.facts.length} sourced facts; healthy/deep/shallow/young/close/excess/early/late/repeated/incorrect-sort outcomes; real input required; shared loop and blocked storage; credits and dist.`);

assert(!app.includes('showWorkshop'),'Remove the old single-craft empty-state flag');

for(const f of ['data/simple-crafts.js','workshop-simple-engine.js','workshop-simple.js','workshop-craft-draw.js','textile-pottery.js','data/textile-pottery.js'])new vm.Script(await read(f),{filename:f});
for(const f of ['data/simple-crafts.js','workshop-simple-engine.js','data/textile-pottery.js'])vm.runInNewContext(await read(f),c,{filename:f});
const guided=c.window.OMANI_SIMPLE_CRAFTS,SE=c.window.SimpleCraftEngine;
for(const [kind,data]of Object.entries(guided)){
 assert.equal(data.steps.length,3);assert(data.steps.every(st=>st.title&&st.text&&st.action));
 const facts=kind==='halwa'?C.facts:kind==='frankincense'?F.facts:c.window.OMANI_TEXTILE_POTTERY[kind].facts;for(const id of data.sourceIds)assert(facts.some(f=>f.id===id));
 for(const m of Object.values(data.media)){assert(m.src&&m.author&&m.license&&m.licenseUrl&&m.url);assert((await stat(new URL('../'+m.src,import.meta.url))).size>0);}
}
const quickH=SE.create(guided.halwa);quickH.tick(30);assert.equal(quickH.state.stage,0,'Idle cannot add ingredients');quickH.act();quickH.tick(30);assert.equal(quickH.state.progress,0,'Idle cannot stir');quickH.stir(NaN);assert.equal(quickH.state.progress,0);
for(let i=0;i<5;i++)quickH.act();assert.equal(quickH.state.stage,2);assert(quickH.state.aromas);quickH.act();assert(quickH.state.busy);assert(!quickH.act(),'Repeated input cannot skip pouring');quickH.tick(guided.halwa.transitionSeconds);assert(quickH.state.done);assert(!quickH.act());
const quickF=SE.create(guided.frankincense);quickF.act();assert.equal(quickF.state.stage,1);quickF.tick(20);assert.equal(quickF.state.progress,0,'Waiting starts with an actual action');quickF.act();assert(quickF.state.busy);quickF.tick(1);assert.equal(quickF.state.stage,1);assert(!quickF.act());quickF.tick(2);assert.equal(quickF.state.stage,2);assert(!quickF.state.done);quickF.act();assert(quickF.state.done);
console.log('PASS: four guided crafts have three sourced steps; original stirring, accelerated waiting, pouring and licensed tree/bark photographs preserved.');

// A timed completion must flush its final UI even between paint/UI intervals.
let running=true,finalUI=0,finalPaint=0;
const finishing=ctx.window.WorkshopShared.createLoop({step:.01,uiInterval:10,canRun:()=>running,onStep:()=>{running=false;},onDraw:()=>finalPaint++,onUI:()=>finalUI++});finishing.start();frame(1);frame(12);assert.equal(finalUI,1);assert.equal(finalPaint,1);assert.equal(pending.size,0);

// New crafts must require input at each boundary and preserve the material sequence.
assert.equal(Object.keys(guided).length,4);
const catalog=vm.runInNewContext(app.match(/const CRAFTS = (\[[\s\S]*?\n\]);/)[1]);
assert.equal(new Set(catalog.map(v=>v.id)).size,4);assert.equal(new Set(catalog.map(v=>v.api)).size,4);
for(const craft of catalog){assert(html.includes('id="'+craft.root+'"'));assert(html.includes('id="'+craft.heading+'"'));assert.equal(craft.hash,'workshop/'+craft.id);await stat(new URL('../assets/images/workshop/'+craft.image,import.meta.url));for(const file of craft.files)await stat(new URL('../'+file,import.meta.url));}
for(const kind of ['sadu','pottery'])for(const fact of c.window.OMANI_TEXTILE_POTTERY[kind].facts)sourceRequired(fact);
const textile=SE.create(guided.sadu);textile.work(1);textile.tick(20);assert.equal(textile.state.stage,0);textile.act();textile.tick(20);assert.equal(textile.state.progress,0);textile.work(NaN);assert.equal(textile.state.progress,0);
for(let i=0;i<4;i++)textile.act();assert.equal(textile.state.stage,2);assert.equal(textile.state.progress,0);assert(!textile.state.done,'Spinning must not complete weaving');textile.tick(20);assert.equal(textile.state.progress,0);for(let i=0;i<4;i++)textile.act();assert(textile.state.done);assert(!textile.act());
const pot=SE.create(guided.pottery);pot.act();pot.tick(20);assert.equal(pot.state.progress,0);pot.work(100);assert.equal(pot.state.progress,.25,'A single input cannot skip shaping');for(let i=0;i<3;i++)pot.act();assert.equal(pot.state.stage,2);assert(!pot.state.done);pot.act();assert(pot.state.busy);assert(!pot.act());pot.tick(.9);assert(pot.state.progress<1/3);pot.tick(.2);assert(pot.state.progress>1/3&&pot.state.progress<2/3);const progress=pot.state.progress;pot.tick(-10);assert.equal(pot.state.progress,progress);pot.tick(3);assert(pot.state.done);assert(!pot.act());
const extraCredits=JSON.parse(await read('data/textile-pottery-image-credits.json'));
for(const kind of ['sadu','pottery']){const media=guided[kind].media.reference,credit=extraCredits.find(c=>c.craft===kind);assert.equal(credit.src,media.src);assert.equal(credit.license,media.license);assert(credit.author&&credit.caption&&credit.changes);assert((await stat(new URL('../'+media.src,import.meta.url))).size<=153600);}
assert(guided.sadu.media.reference.caption.includes('الإمارات'),'Do not mislabel the reference photograph as Omani');
assert(simpleUI.includes('!e.repeat'),'Held keys must stop at a stage boundary');
console.log('PASS: Sadu preparation → spinning → weaving; pottery preparation → shaping → drying/firing/cooling; real input, timing guards, four routes, sources, licensed photographs and dist.');
