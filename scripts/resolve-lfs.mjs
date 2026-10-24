import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {open, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

// Some static hosts check out Git LFS pointers without downloading their objects.
// Resolve only those pointers, using this deployment's exact public Git revision.
export async function resolveLfs(root) {
  let revision;
  async function visit(directory) {
    for (const entry of await readdir(directory, {withFileTypes:true})) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await visit(file); continue; }
      if (!entry.isFile()) continue;
      const handle = await open(file, 'r');
      let header;
      try {
        const {buffer, bytesRead} = await handle.read(Buffer.alloc(1024), 0, 1024, 0);
        header = buffer.toString('utf8', 0, bytesRead);
      } finally { await handle.close(); }
      if (!header.startsWith('version https://git-lfs.github.com/spec/v1\n')) continue;
      const oid = header.match(/^oid sha256:([a-f0-9]{64})$/m)?.[1];
      const size = Number(header.match(/^size (\d+)$/m)?.[1]);
      assert(oid && Number.isSafeInteger(size) && size > 0, `Invalid LFS pointer: ${file}`);
      revision ||= process.env.VERCEL_GIT_COMMIT_SHA || execFileSync('git', ['rev-parse','HEAD'], {cwd:root, encoding:'utf8'}).trim();
      assert(/^[a-f0-9]{40}$/.test(revision), 'A full Git commit SHA is required to resolve LFS files');
      const relative = path.relative(root, file).split(path.sep).join('/');
      const encoded = relative.split('/').map(encodeURIComponent).join('/');
      const url = `https://media.githubusercontent.com/media/atheer09090-prog/al-mawsoaa/${revision}/${encoded}`;
      const response = await fetch(url, {signal:AbortSignal.timeout(120000)});
      assert(response.ok, `Unable to download original LFS file (${response.status}): ${relative}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.length, size, `LFS file size mismatch: ${relative}`);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), oid, `LFS checksum mismatch: ${relative}`);
      await writeFile(file, bytes);
      console.log(`Verified original LFS file: ${relative}`);
    }
  }
  await visit(path.join(root, 'assets'));
}
