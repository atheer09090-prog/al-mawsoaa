import assert from 'node:assert/strict';
import {readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const text = name => readFile(path.join(root, name), 'utf8');
const html = await text('index.html');
const app = await text('app.js');
const registry = await text('data/content.js');
const context = {window:{}};
vm.runInNewContext(registry, context);
const items = context.window.OMANI_CONTENT;
const sectionSource = app.match(/const SECTIONS = (\[[\s\S]*?\n\]);/)[1];
const sections = vm.runInNewContext(sectionSource);
const ids = new Set();
const files = new Map();
let localRefs = 0;
async function checkRef(ref) {
  if (!ref || ref.startsWith('#') || ref.startsWith('?')) return;
  const url = new URL(ref, 'https://local.invalid/al-mawsoaa/');
  if (url.origin !== 'https://local.invalid') {
    assert(['https:','data:'].includes(url.protocol), `Unsafe URL: ${ref}`);
    return;
  }
  assert(!ref.startsWith('/'), `Root-relative URL breaks project hosting: ${ref}`);
  const relative = decodeURIComponent(url.pathname.replace(/^\/al-mawsoaa\//, ''));
  assert(!relative.includes('..'), `Path escapes site: ${ref}`);
  assert((await stat(path.join(root, relative))).isFile(), `Missing asset: ${ref}`);
  localRefs++;
}
for (const item of items) {
  assert(item.id && item.title && sections.some(s=>s.id===item.section), 'Invalid resource');
  assert(!ids.has(item.id), `Duplicate resource id: ${item.id}`); ids.add(item.id);
  for (const key of ['file','attachment','embed','url','preview','cover']) await checkRef(item[key]);
  for (const entry of item.pages || []) await checkRef(entry.src);
  for (const entry of item.downloads || []) await checkRef(entry.file);
  for (const source of [item.file, item.embed, item.url].filter(Boolean)) {
    assert(!files.has(source), `Resource is listed twice: ${source}`); files.set(source,item.id);
  }
}
const domIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(domIds).size, domIds.length, 'Duplicate HTML id');
for (const s of sections) {
  assert(html.includes(`data-route="${s.id}"`), `Navigation missing ${s.id}`);
  assert(domIds.includes(`i-${s.id}`), `Missing section icon ${s.id}`);
  if(!['practice','podcasts'].includes(s.id)) {
    await checkRef(`assets/images/${s.id}.webp`);
    await checkRef(`assets/images/${s.id}-small.webp`);
  }
}
for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) await checkRef(m[1]);
const css = await text('styles.css');
for (const m of css.matchAll(/url\(["']?([^\s)'";]+)["']?\)/g)) await checkRef(m[1]);
for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(m[1]);
new vm.Script(app); new vm.Script(registry);
for (const file of await readdir(path.join(root,'assets/content/games'))) {
  if (!file.endsWith('.html')) continue;
  const game = await text('assets/content/games/'+file);
  for (const m of game.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(m[1], {filename:file});
}
// The museum game's clips and branching scenes live below its HTML entry point.
const museumPath = 'assets/content/games/museum/';
const museumScenes = JSON.parse(await text(museumPath + 'scenes.json'));
assert.equal(museumScenes.length, 35, 'Museum scenes missing');
assert.equal(museumScenes.filter(scene=>scene.question).length, 8, 'Museum questions missing');
for (const [i, scene] of museumScenes.entries()) {
  assert.equal(scene.slide, i + 1, 'Museum scene order changed');
  for (const key of ['media','poster','background']) if (scene[key]) await checkRef(museumPath + scene[key]);
  if (scene.question) assert.equal(scene.answers.length, 3, 'Museum answer missing');
  for (const action of [...scene.answers, ...scene.actions]) {
    assert(Number.isInteger(action.target) && action.target >= 1 && action.target <= museumScenes.length, 'Broken museum scene destination');
  }
}
for (const file of ['game.js','game.css']) await checkRef(museumPath + file);
new vm.Script(await text(museumPath + 'game.js'), {filename:'museum/game.js'});
assert.equal(await text('content.js'), registry, 'Legacy registry is out of sync; run build');
for (const id of ['video-omani-drum','video-tab-tanyan']) assert.equal(items.find(i=>i.id===id)?.section,'practice');
assert(items.filter(i=>i.section==='practice').every(i=>i.file.endsWith('.mp4')));
assert.equal(items.find(i=>i.id==='presentation-frankincense-tree-video').section,'library');
assert(!items.some(i=>i.id==='presentation-omani-frankincense'));
for(const name of ['omani-frankincense.pdf','omani-frankincense.pptx']) {
  await assert.rejects(stat(path.join(root,'assets/content/presentations',name)));
}
// Preserve the approved opening markup and behavior against a checked-in digest.
const baseline = JSON.parse(await text('scripts/opening-baseline.json'));
const {createHash} = await import('node:crypto');
const digest = value => createHash('sha256').update(value).digest('hex');
assert.equal(digest(html.slice(html.indexOf('  <div class="splash"'), html.indexOf('\n  <header'))),baseline.markup);
assert.equal(digest(app.slice(app.indexOf('function intro()'),app.indexOf('/* ---------- Scroll effects'))),baseline.logic);
async function compareDirectory(relative='') {
  for(const entry of await readdir(path.join(root,'dist',relative),{withFileTypes:true})) {
    assert(entry.name!=='.DS_Store','macOS metadata leaked into dist');
    const name=path.join(relative,entry.name);
    if(entry.isDirectory()) await compareDirectory(name);
    else assert((await readFile(path.join(root,name))).equals(await readFile(path.join(root,'dist',name))),`dist differs: ${name}`);
  }
}
await compareDirectory();
for (const file of files.keys()) {
  if (!file.endsWith('.pptx')) continue;
  const bytes = await readFile(path.join(root, file));
  assert.equal(bytes.subarray(0,4).toString('hex'), '504b0304', `PowerPoint contains an LFS pointer instead of the original file: ${file}`);
}
console.log(`PASS: ${sections.length} sections, ${items.length} unique resources, ${localRefs} local references; scripts, opening, downloads and dist verified.`);
