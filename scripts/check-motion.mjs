import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app = await readFile(new URL('../app.js',import.meta.url),'utf8');
const source = app.slice(app.indexOf('function initSchoolGallery()'), app.indexOf('/* ---------- Boot'));
function fixture(reduced,grid=false) {
  const callbacks = new Map(); let nextId=0;
  const node = () => ({events:{},attributes:{},addEventListener(k,f){this.events[k]=f},setAttribute(k,v){this.attributes[k]=v},querySelector(){return {textContent:'',innerHTML:''}},contains(){return false}});
  const names = ['schoolGallery','galleryViewport','galleryTrack','galleryPause','galleryPrev','galleryNext'];
  const nodes = Object.fromEntries(names.map(k=>[k,node()]));
  nodes.schoolGallery.dataset={layout:grid?'grid':'ribbon'};
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
const grid=fixture(false,true);assert.equal(grid.callbacks.size,0,'The home photo grid must never start a scrolling loop');
assert.equal(reduced.nodes.schoolGallery.attributes['data-motion'],'paused','Reduced motion must pause the glow');
const active=fixture(false);assert.equal(active.callbacks.size,1);
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'running');
active.tick(1000); active.tick(1700);
const start=active.nodes.galleryViewport.scrollLeft;
for(let t=1716;t<=2700;t+=16)active.tick(t);
const distance=active.nodes.galleryViewport.scrollLeft-start;
assert(distance>19&&distance<21,'Ribbon must accumulate fractional motion smoothly at 20px/s');
active.nodes.galleryViewport.events.wheel();
assert.equal(active.callbacks.size,0,'Manual scrolling must pause the ribbon');
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'paused','Manual scrolling must pause the glow');
active.nodes.galleryPause.events.click({detail:1});
assert.equal(active.callbacks.size,0,'Pause button must stop the ribbon');
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'paused','Pause button must also stop the glow');
active.nodes.galleryPause.events.click({detail:1});
assert.equal(active.callbacks.size,1,'Resume must restart the ribbon');
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'running');
active.nodes.schoolGallery.events.pointerenter({pointerType:'mouse'});
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'paused','Hover must also pause the glow');
active.nodes.schoolGallery.events.pointerleave({pointerType:'mouse'});
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'running');
active.preference.change({matches:true});assert.equal(active.callbacks.size,0,'Live reduced-motion change must cancel animation');
assert.equal(active.nodes.schoolGallery.attributes['data-motion'],'paused');
console.log('PASS: gallery autoplay, fractional movement, coordinated glow, pause/hover/resume and live reduced-motion preference.');
