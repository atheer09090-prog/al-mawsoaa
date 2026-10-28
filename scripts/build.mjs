import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {resolveLfs} from './resolve-lfs.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
await resolveLfs(root);
// Drop a named, verified photograph into the folder and rebuild: no app edit required.
const halwaFiles=(await readdir(path.join(root,'assets/images/workshop/halwa'))).filter(name=>/^(prep|tools|slurry|pot-pale|pot-golden|pot-amber|pot-thick|pour|serve)-(wide|square)\.webp$/.test(name)).sort();
await writeFile(path.join(root,'data/halwa-media.js'),'window.OMANI_HALWA_MEDIA = '+JSON.stringify(halwaFiles)+';\n');
const frankDirectory=path.join(root,'assets/images/workshop/frankincense');
const frankCredits=JSON.parse(await readFile(path.join(root,'data/frankincense-image-credits.json'),'utf8'));
const frankFiles=(await readdir(frankDirectory)).filter(name=>/^(tree|tree-east|tree-nejd|tree-west|tree-plain|bark|cut|resin-fresh|resin-hardening|resin-hard|collection|sorting|storage|burner)-(wide|square)\.webp$/.test(name)).sort();
for(const file of frankFiles){const c=frankCredits.find(c=>c.file===file);if(!c?.author||!c.license||!c.url)throw new Error('Missing photograph credit: '+file);}
await writeFile(path.join(root,'data/frankincense-media.js'),'window.OMANI_FRANKINCENSE_MEDIA = '+JSON.stringify({files:frankFiles,credits:frankCredits})+';\n');
// Keep the legacy data entry point identical to the authoritative registry.
await writeFile(path.join(root, 'content.js'), await readFile(path.join(root, 'data/content.js')));
await rm(destination, {recursive:true, force:true});
await mkdir(destination, {recursive:true});
for (const entry of ['index.html','app.js','journey.js','motion.js','halwa-engine.js','workshop-shared.js','workshop-simple-engine.js','workshop-simple.js','workshop-craft-draw.js','textile-pottery.js','workshop-simple.css','workshop.js','workshop.css','frankincense-engine.js','frankincense.js','frankincense.css','journey.css','styles.css','data','assets']) {
  await cp(path.join(root, entry), path.join(destination, entry), {
    recursive:true, filter:source => !['.DS_Store','Thumbs.db'].includes(path.basename(source))
  });
}
console.log('Built static site in dist/ (no installation required).');
