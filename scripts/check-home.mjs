import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import vm from 'node:vm';
const read=name=>readFile(new URL('../'+name,import.meta.url),'utf8');
const source=await read('home.js');
function fixture(reduced=false){
  const node=(caption='')=>({dataset:{caption},attributes:{},events:{},textContent:'',disabled:false,
    classList:{values:new Set(),contains(v){return this.values.has(v)},toggle(v,on){on?this.values.add(v):this.values.delete(v)}},
    setAttribute(k,v){this.attributes[k]=v},addEventListener(k,f){this.events[k]=f},querySelector(){return this.child??=(node())},contains(){return false}});
  const timers=new Map();let serial=0,observer;
  const document={hidden:false,activeElement:null,documentElement:node(),events:{},addEventListener(k,f){this.events[k]=f}};
  const preference={matches:reduced,addEventListener(k,f){this.change=f}};
  const env={document,matchMedia:()=>preference,setTimeout(f,delay){timers.set(++serial,{f,delay});return serial},clearTimeout(id){timers.delete(id)},IntersectionObserver:class{constructor(f){observer=f}observe(){}}};
  const context={window:env,document};vm.runInNewContext(source,context);
  const nodes={root:node(),page:node(),slides:['نزوى','بركة الموز','ظفار','الرمال'].map(node),dots:Array.from({length:4},()=>node()),previous:node(),next:node(),pause:node(),caption:node(),status:node()};
  nodes.page.classList.toggle('is-active',true);
  const api=env.OmaniHome.createHeroSlider(nodes,env);
  return {nodes,env,document,preference,timers,api,intersection:on=>observer([{isIntersecting:on}]),tick(){const [id,{f}]=timers.entries().next().value;timers.delete(id);f()}};
}
const a=fixture();
assert.equal(a.timers.size,1);assert.equal([...a.timers.values()][0].delay,7000);
a.tick();assert.equal(a.nodes.caption.textContent,'بركة الموز');assert.equal(a.timers.size,1);
assert.equal(a.nodes.slides.filter(s=>s.attributes['aria-hidden']==='false').length,1);
assert.equal(a.nodes.dots[1].attributes['aria-current'],'true');
a.nodes.root.events.pointerenter({pointerType:'mouse'});assert.equal(a.timers.size,0);
a.nodes.root.events.pointerleave({pointerType:'mouse'});assert.equal(a.timers.size,1);
a.nodes.root.events.focusin();assert.equal(a.timers.size,0);
a.nodes.root.events.focusout();a.tick();assert.equal(a.timers.size,1);
a.document.hidden=true;a.document.events.visibilitychange();assert.equal(a.timers.size,0);
a.document.hidden=false;a.document.events.visibilitychange();assert.equal(a.timers.size,1);
a.intersection(false);assert.equal(a.timers.size,0);a.intersection(true);assert.equal(a.timers.size,1);
a.document.documentElement.classList.toggle('splash-on',true);a.api.sync();assert.equal(a.timers.size,0,'The opening must not run a hidden carousel');
a.document.documentElement.classList.toggle('splash-on',false);a.api.sync();assert.equal(a.timers.size,1);
a.nodes.page.classList.toggle('is-active',false);a.document.events['omani:routechange']();assert.equal(a.timers.size,0);
a.nodes.page.classList.toggle('is-active',true);a.document.events['omani:routechange']();assert.equal(a.timers.size,1);
a.nodes.pause.events.click();assert.equal(a.timers.size,0);assert.equal(a.nodes.pause.attributes['aria-pressed'],'true');
a.preference.matches=true;a.preference.change();a.preference.matches=false;a.preference.change();assert.equal(a.timers.size,0,'An explicit pause must survive a preference change');
a.nodes.next.events.click();assert.equal(a.nodes.caption.textContent,'ظفار');assert(a.nodes.status.textContent.includes('3'));
a.nodes.pause.events.click();assert.equal(a.timers.size,1);
const reduced=fixture(true);assert.equal(reduced.timers.size,0);assert(reduced.nodes.pause.disabled);
reduced.nodes.previous.events.click();assert.equal(reduced.nodes.caption.textContent,'الرمال');assert.equal(reduced.timers.size,0,'Reduced motion still allows deliberate navigation');
const html=await read('index.html');
assert(html.includes('data-layout="grid"'),'The learning photographs must use a grid');
assert(!html.includes('id="galleryPause"'),'The static school grid must not expose obsolete autoplay controls');
assert(html.includes('id="heroSearchInput"')&&source.includes("'omani:search'"));
assert((await read('app.js')).includes("typeof initialQuery === 'string' ? initialQuery : ''"));
assert(source.includes("timeZone: 'Asia/Muscat'"));
const journeyContext={window:{}};vm.runInNewContext(await read('data/journey.js'),journeyContext);
for(const id of ['mountain-winter','darbat-green','green-turtles'])assert(JSON.stringify(journeyContext.window.OMANI_JOURNEY).includes(id));
const credit=JSON.parse(await read('data/home-hero-credits.json'));
assert(credit.author&&credit.licenseUrl&&credit.url);
for(const file of credit.files){const f=await stat(new URL('../'+file.src,import.meta.url));assert.equal(f.size,file.bytes);assert(f.size<320000,'Hero photograph exceeds the image budget')}
for(const name of ['home.css','home.js'])assert.equal(await read(name),await read('dist/'+name));
console.log('PASS: hero autoplay, one active slide, manual controls, focus/hover/visibility/route pauses, reduced motion, real search, destination links, Oman date, grid gallery and licensed local photos.');
