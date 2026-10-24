import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app = await readFile(new URL('../app.js',import.meta.url),'utf8');
const source = app.slice(app.indexOf('function initSchoolGallery()'), app.indexOf('/* ---------- Boot'));
function fixture(reduced) {
  const callbacks = new Map(); let nextId=0;
  const node = () => ({events:{},addEventListener(k,f){this.events[k]=f},setAttribute(){},querySelector(){return {textContent:'',innerHTML:''}},contains(){return false}});
  const names = ['schoolGallery','galleryViewport','galleryTrack','galleryPause','galleryPrev','galleryNext'];
  const nodes = Object.fromEntries(names.map(k=>[k,node()]));
  Object.assign(nodes.galleryViewport,{scrollLeft:0,scrollWidth:1800,clientWidth:600});
  const card = node(); const preference = {matches:reduced,addEventListener(type,f){this.change=f}};
  const context = {window:{},document:{hidden:false,addEventListener(){}},performance:{now:()=>0},setTimeout(){},
    matchMedia:()=>preference,$:selector=>nodes[selector.slice(1)]||null,$$:()=>[card],
    requestAnimationFrame:f=>{callbacks.set(++nextId,f);return nextId},cancelAnimationFrame:id=>callbacks.delete(id)};
  context.window=context;
  vm.runInNewContext(source+'\ninitSchoolGallery();',context);
  return {nodes,callbacks,preference,tick(time){const [id,f]=callbacks.entries().next().value;callbacks.delete(id);f(time)}};
}
const reduced=fixture(true);assert.equal(reduced.callbacks.size,0,'Reduced motion must stop autoplay');
const active=fixture(false);assert.equal(active.callbacks.size,1);
active.tick(1000); active.tick(1700);
const start=active.nodes.galleryViewport.scrollLeft;
for(let t=1716;t<=2700;t+=16)active.tick(t);
const distance=active.nodes.galleryViewport.scrollLeft-start;
assert(distance>19&&distance<21,'Ribbon must accumulate fractional motion smoothly at 20px/s');
active.preference.change({matches:true});assert.equal(active.callbacks.size,0,'Live reduced-motion change must cancel animation');
console.log('PASS: gallery autoplay, fractional movement and live reduced-motion preference.');
