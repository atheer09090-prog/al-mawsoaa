import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {resolveLfs} from './resolve-lfs.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
await resolveLfs(root);
// Keep the legacy data entry point identical to the authoritative registry.
await writeFile(path.join(root, 'content.js'), await readFile(path.join(root, 'data/content.js')));
await rm(destination, {recursive:true, force:true});
await mkdir(destination, {recursive:true});
for (const entry of ['index.html','app.js','styles.css','data','assets']) {
  await cp(path.join(root, entry), path.join(destination, entry), {
    recursive:true, filter:source => !['.DS_Store','Thumbs.db'].includes(path.basename(source))
  });
}
console.log('Built static site in dist/ (no installation required).');
