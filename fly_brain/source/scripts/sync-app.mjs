import { readFile, readdir, copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const source = fileURLToPath(new URL('../dist/', import.meta.url));
const target = fileURLToPath(new URL('../../app/', import.meta.url));
if (!existsSync(path.join(source, 'index.html')) || !existsSync(path.join(target, 'static-data/index.json'))) {
  throw Error('Run build:pages from fly_brain/source before synchronizing the sibling app folder.');
}
async function files(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.join(prefix, entry.name);
    if (entry.name.includes('.bak-')) continue;
    if (entry.isDirectory()) result.push(...await files(path.join(directory, entry.name), name));
    else if (entry.isFile()) result.push(name);
  }
  return result;
}
const changed = [];
for (const name of await files(source)) {
  const destination = path.join(target, name);
  if (!existsSync(destination) || !(await readFile(destination)).equals(await readFile(path.join(source, name)))) changed.push(name);
}
// Switch the entry point only after the assets it references are available.
changed.sort((a, b) => Number(a === 'index.html') - Number(b === 'index.html'));
if (!process.argv.includes('--apply')) {
  console.log('Preview only. Re-run with --apply to back up and synchronize these files:');
  console.log(changed.join('\n') || 'No changes.');
} else {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  for (const name of changed) {
    const destination = path.join(target, name);
    await mkdir(path.dirname(destination), { recursive: true });
    if (existsSync(destination)) await copyFile(destination, `${destination}.bak-${stamp}`);
    await copyFile(path.join(source, name), destination);
  }
  console.log(`Synchronized ${changed.length} files locally; nothing was uploaded.`);
}
