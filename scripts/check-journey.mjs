import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>readFile(path.join(root,name),'utf8');
const data=await read('data/journey.js'),script=await read('journey.js'),html=await read('index.html'),app=await read('app.js'),css=await read('journey.css');
const context={window:{},Intl,Date,matchMedia:()=>({matches:false})};
vm.runInNewContext(await read('data/content.js'),context);
vm.runInNewContext(data,context);
vm.runInNewContext(script,context);
const entries=context.window.OMANI_JOURNEY,credits=JSON.parse(await read('data/image-credits.json'));
const resources=new Set(context.window.OMANI_CONTENT.map(e=>'#'+e.section+'/'+encodeURIComponent(e.id)));
function sourceRequired(entry){
  assert(entry.fact&&entry.source,'Fact has no source: '+entry.id);
  assert(['encyclopedia','supporting'].includes(entry.source.kind),'Unknown source kind');
  if(entry.source.kind==='encyclopedia')assert(entry.source.entryTitle,'Encyclopedia fact has no entry title');
  assert(entry.source.entryTitle&&entry.source.note,'Missing source identity or limits');
  assert(entry.source.volume===null||typeof entry.source.volume==='string'||Number.isInteger(entry.source.volume));
  assert(entry.source.page===null||typeof entry.source.page==='string'||Number.isInteger(entry.source.page));
  if(entry.source.url)assert.equal(new URL(entry.source.url).protocol,'https:');
  for(const ref of entry.source.references || []){assert(ref.entryTitle);assert.equal(new URL(ref.url).protocol,'https:');}
}
assert.throws(()=>sourceRequired({id:'missing',fact:'حقيقة'}));
assert.throws(()=>sourceRequired({id:'entry',fact:'حقيقة',source:{kind:'encyclopedia'}}));
assert.equal(entries.length,12);
assert.equal(new Set(entries.map(e=>e.id)).size,12);
assert.deepEqual(Array.from(entries,e=>e.month),Array.from({length:12},(_,i)=>i+1));
for(const entry of entries){
  sourceRequired(entry);assert(entry.verified);
  assert.equal(entry.narrative.length,2,'Narrative must have two short sentences');
  assert(!entry.encyclopediaLink||resources.has(entry.encyclopediaLink),'Invented resource link');
  for(const photo of [entry.image,entry.detail]){
    assert(photo.alt&&photo.focal&&photo.creditId&&photo.credit.author&&photo.credit.license);
    assert(photo.src.startsWith('assets/images/journey/'),'Photo must be local');
    const variants=[...photo.srcset.matchAll(/(assets\/[^, ]+) (\d+)w/g)];
    assert.deepEqual(variants.map(m=>Number(m[2])),[640,1200,1800]);
    for(const [,file]of variants)assert((await stat(path.join(root,file))).isFile());
    const credit=credits.find(c=>c.id===photo.creditId);assert(credit,'Missing attribution');
    assert.equal(credit.author,photo.credit.author);assert.equal(credit.license,photo.credit.license);
  }
}
assert.equal(credits.length,12);
assert.equal(new Set(entries.map(e=>e.image.src)).size,12,'Primary scenes must be distinct');
let photoFiles=0;
for(const credit of credits){
  assert(credit.author&&credit.license.startsWith('CC BY')&&credit.url&&credit.licenseUrl&&credit.changes);
  assert.equal(new URL(credit.url).hostname,'commons.wikimedia.org');
  assert.equal(credit.files.length,6);
  for(const file of credit.files){
    const b=await readFile(path.join(root,file.src));assert.equal(b.length,file.bytes);assert(b.length<=180000,'Photo exceeds 180 kB');
    assert.equal(b.toString('ascii',8,12),'WEBP');
    const chunk=b.toString('ascii',12,16);
    const width=chunk==='VP8 '?b.readUInt16LE(26)&0x3fff:b.readUIntLE(24,3)+1;
    const height=chunk==='VP8 '?b.readUInt16LE(28)&0x3fff:b.readUIntLE(27,3)+1;
    assert.equal(width,file.width);assert.equal(height,file.height);photoFiles++;
  }
}
const keys=context.window.OmaniJourney.chapterIndex;
assert.equal(keys(0,'ArrowLeft',12),1);assert.equal(keys(1,'ArrowRight',12),0);
assert.equal(keys(11,'ArrowDown',12),11);assert.equal(keys(0,'ArrowUp',12),0);
assert.equal(keys(4,'Home',12),0);assert.equal(keys(4,'End',12),11);assert.equal(keys(4,'Tab',12),null);
assert(context.window.OmaniJourney.search('الورد').some(e=>e.hash==='journey/rose-picking'));
assert(context.window.OmaniJourney.search('').some(e=>e.hash==='journey'));
assert(context.window.OmaniJourney.search('').some(e=>e.hash==='image-credits'));
assert.equal(context.window.OmaniJourney.legacy('rose-water'),'rose-picking');
for(const id of ['page-journey','journeyTeaser','journeySourceDialog','journeyCurrentLink','journeyRail'])assert(html.includes('id="'+id+'"'));
assert(!html.includes('id="journeySources"')&&!html.includes('journey-sources section-shell'),'Long source list must stay removed');
assert(!html.includes('id="calendar"')&&!html.includes('data/calendar.js')&&!html.includes('src="calendar.js'));
assert(app.includes("page === 'journey'")&&app.includes("page === 'calendar'")&&app.includes('OmaniJourney?.enter'));
assert(html.includes('class="knowledge-grid"'),'Knowledge doors must remain a grid');
assert(css.includes('animation-timeline:var(--chapter-timeline)')&&script.includes('IntersectionObserver'));
assert(css.includes('prefers-reduced-motion:reduce')&&css.includes('.journey-linear .journey-canvas{position:relative'),'Reduced motion cannot pin the screen');
assert(!/setInterval\(/.test(script),'Journey must not autoplay');
assert(script.includes("if(linear())loadChapter"),'Overlapping hidden scenes must not all load');
for(const legacy of ['calendar.js','data/calendar.js','scripts/check-calendar.mjs'])await assert.rejects(stat(path.join(root,legacy)));
const mediaFn=app.match(/function prepareSplashMedia\([\s\S]*?\n\}/)[0];
function splash(shown,hash){
  const image={dataset:{src:'photo.webp',srcset:'photo.webp 1600w'},getAttribute(){return null}};
  vm.runInNewContext(mediaFn+';prepareSplashMedia();',{location:{hash},document:{documentElement:{classList:{contains:()=>shown}}},$:()=>image});
  return image;
}
assert.equal(splash(true,'#journey').src,undefined);assert.equal(splash(false,'#home').src,undefined);assert.equal(splash(true,'#home').src,'photo.webp');
new vm.Script(script);new vm.Script(data);new vm.Script(await read('motion.js'));
const noPages=entries.filter(e=>e.source.volume===null||e.source.page===null).map(e=>({month:e.month,id:e.id,kind:e.source.kind,volume:e.source.volume,page:e.source.page}));
console.log('Source fields unavailable (reported, never invented): '+JSON.stringify(noPages));


const linearSource=script.match(/const linear = [^;]+;/)[0];
function mode(reduced,short,manual,observer){
  const f={preference:{matches:reduced},shortViewport:{matches:short},manualLinear:manual,window:observer?{IntersectionObserver(){}}:{}};
  return vm.runInNewContext(linearSource+';linear()',f);
}
assert(mode(true,false,false,true),'System reduced motion must use a linear reading');
assert(mode(false,true,false,true),'Very short viewports must not clip the story');
assert(mode(false,false,true,true),'Manual quiet reading must use a linear reading');
assert(mode(false,false,false,false),'Missing IntersectionObserver must still expose every chapter');
assert(!mode(false,false,false,true));

const motionContext={window:{},document:{documentElement:{dataset:{}}},matchMedia:()=>({matches:true})};
vm.runInNewContext(await read('motion.js'),motionContext);
let calls=0;motionContext.window.OmaniMotion.run(()=>calls++);
assert.equal(calls,1,'Reduced motion must bypass page snapshots');
motionContext.matchMedia=()=>({matches:false});motionContext.window.OmaniMotion.run(()=>calls++);
assert.equal(calls,2,'A browser without View Transitions must still route');

console.log('PASS: 12 sourced journey chapters, '+credits.length+' licensed photos / '+photoFiles+' variants; sources, RTL keys, search, aliases, image budgets and original opening checked.');
