import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=name=>readFile(path.join(root,name),'utf8');
const calendarSource=await read('data/calendar.js'), script=await read('calendar.js');
const context={window:{},Intl,Date};
vm.runInNewContext(await read('data/content.js'),context);
vm.runInNewContext(calendarSource,context);
vm.runInNewContext(script,context);
const entries=context.window.OMANI_CALENDAR, credits=JSON.parse(await read('data/image-credits.json'));
const links=new Set(context.window.OMANI_CONTENT.map(item=>`#${item.section}/${encodeURIComponent(item.id)}`));
const ids=new Set(), usedImages=new Set();
for(let month=1;month<=12;month++){
  const count=entries.filter(e=>e.month===month).length;
  assert(count>=1&&count<=3,`Month ${month} must have one to three events`);
}
for(const event of entries){
  assert(!ids.has(event.id),'Duplicate calendar event');ids.add(event.id);
  for(const field of ['title','place','summary','season','sourceNote'])assert(event[field],`Missing ${field}`);
  assert(typeof event.verified==='boolean');
  assert(event.sources.length>0);
  for(const source of event.sources)assert.equal(new URL(source.url).protocol,'https:');
  assert(event.types.length>0&&event.types.every(t=>['طبيعة','تراث','حِرف','مناسبة وطنية'].includes(t)));
  assert(!event.encyclopediaLink||links.has(event.encyclopediaLink),'Invented encyclopedia link');
  const photo=event.image;assert(photo.alt&&photo.focal&&photo.credit.author&&photo.credit.license&&photo.credit.url);
  assert(photo.src.startsWith('assets/images/calendar/'),'Calendar must use local photos');
  assert(!/^https?:/.test(photo.srcset),'Hotlinked image');
  usedImages.add(photo.src);
  const matches=[...photo.srcset.matchAll(/(assets\/[^, ]+) (\d+)w/g)];
  assert.deepEqual(matches.map(m=>Number(m[2])),[640,1200,1800]);
  for(const [,name] of matches)assert((await stat(path.join(root,name))).isFile());
}
assert.equal(credits.length,usedImages.size,'Photo credits must cover every unique image');
for(const credit of credits){
  assert(credit.author&&credit.licenseUrl&&credit.url&&credit.changes);
  assert(credit.license.startsWith('CC BY'),'Unreviewed photo license');
  assert.equal(new URL(credit.url).hostname,'commons.wikimedia.org');
  assert.deepEqual(credit.files.map(f=>f.width),[640,1200,1800]);
  for(const file of credit.files){
    const bytes=await readFile(path.join(root,file.src));
    assert.equal(bytes.length,file.bytes);assert(bytes.length<=180000,'Calendar photo exceeds budget');
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
    const chunk=bytes.toString('ascii',12,16);
    const width=chunk==='VP8 '?bytes.readUInt16LE(26)&0x3fff:bytes.readUIntLE(24,3)+1;
    const height=chunk==='VP8 '?bytes.readUInt16LE(28)&0x3fff:bytes.readUIntLE(27,3)+1;
    assert.equal(width,file.width);assert.equal(height,file.height);
  }
}
const fn=script.match(/function calendarTabIndex\([\s\S]*?\n\}/)[0];
const keys=vm.runInNewContext(fn+';calendarTabIndex');
assert.equal(keys(11,'ArrowLeft',12),0,'RTL left arrow advances and wraps');
assert.equal(keys(0,'ArrowRight',12),11,'RTL right arrow goes back and wraps');
assert.equal(keys(7,'Home',12),0);assert.equal(keys(7,'End',12),11);
assert.equal(keys(0,'ArrowLeft',2),1);assert.equal(keys(1,'ArrowRight',2),0);
assert.equal(keys(0,'Tab',12),null);
assert(context.window.OmaniCalendar.search('الورد').some(item=>item.hash.includes('rose')),'Calendar events missing from search');
assert(context.window.OmaniCalendar.search('').some(item=>item.hash==='calendar'));
assert(context.window.OmaniCalendar.search('').some(item=>item.hash==='image-credits'));
const html=await read('index.html'),app=await read('app.js');
assert(html.indexOf('id="calendar"')>html.indexOf('id="about"'));
assert(html.indexOf('id="calendar"')<html.indexOf('class="learning-band"'));
assert(!html.includes('data-route="calendar"'),'Calendar must not become a ninth knowledge door');
assert(app.includes("'calendar'")&&app.includes('OmaniCalendar?.selectEvent'));
assert.equal((html.match(/id="calendar"/g)||[]).length,1);
assert(script.includes("image.loading = 'lazy'"));
assert(!/setInterval\(/.test(script),'Calendar must not autoplay');
new vm.Script(script);new vm.Script(calendarSource);
// Returning visitors and deep links must never initiate the hidden splash image.
const mediaFn=app.match(/function prepareSplashMedia\([\s\S]*?\n\}/)[0];
function introImageFixture(shown,hash){
  const image={dataset:{src:'assets/images/intro-coast.webp',srcset:'assets/images/intro-coast-small.webp 900w'},getAttribute(){return null}};
  const fixture={location:{hash},document:{documentElement:{classList:{contains:()=>shown}}},$:()=>image};
  vm.runInNewContext(mediaFn+';prepareSplashMedia();',fixture);return image;
}
assert.equal(introImageFixture(false,'#home').src,undefined);
assert.equal(introImageFixture(true,'#calendar').src,undefined);
assert.equal(introImageFixture(true,'#home').src,'assets/images/intro-coast.webp');
assert.equal(introImageFixture(true,'#home').fetchPriority,'high');
const splashTag=html.match(/<img class="splash-landscape"[^>]*>/)[0];
assert(!/\ssrc=/.test(splashTag),'Hidden splash image must not have a parser-loaded source');
assert(!/\ssrcset=/.test(splashTag));
assert(html.includes('class="knowledge-grid"')&&!html.includes('id="bays" class="bays"'),'Knowledge doors must stay a grid');
context.document={documentElement:{dataset:{}}};context.matchMedia=()=>({matches:true});
let updated=0;context.window.OmaniMotion.run(()=>updated++);assert.equal(updated,1,'Reduced motion must update immediately');
context.matchMedia=()=>({matches:false});context.window.OmaniMotion.run(()=>updated++);assert.equal(updated,2,'Browsers without View Transitions must update normally');
console.log(`PASS: ${entries.length} events across 12 months, ${credits.length} licensed photos / 30 responsive files; RTL keys, search, genuine resource links and image budgets verified.`);
