import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL(existsSync(new URL('../../app/static-data/', import.meta.url))
  ? '../../app/' : '../public/', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
let hashes = 0;
for (const directory of ['static-data', 'data/flybody-full']) {
  const manifest = await json(`${directory}/manifest.json`);
  for (const [name, digest] of Object.entries(manifest.sha256)) {
    const bytes = await readFile(new URL(`${directory}/${name}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), digest, `${directory}/${name}`);
    hashes++;
  }
}
const index = await json('static-data/index.json');
let runs = 0, frames = 0;
for (const entry of index.runs) {
  for (const hop of entry.mode === 'path' ? index.hops : [null]) {
    const name = `${entry.id}${hop === null ? '' : `-h${hop}`}.json`;
    const run = await json(`static-data/runs/${name}`);
    assert.equal(run.mode, entry.mode, name);
    assert.equal(run.seedCount, entry.seedCount, name);
    assert.equal(run.direction, entry.kind === 'population' ? 'downstream'
      : index.meta.presets.find(preset => preset.id === entry.preset).direction, name);
    assert.equal(run.frames.length, run.times.length, name);
    if (hop !== null) assert.equal(run.frames.length, hop + 1, name);
    for (const [position, frame] of run.frames.entries()) {
      assert.equal(frame.time, run.times[position], name);
      assert.ok(position === 0 || frame.time > run.frames[position - 1].time, name);
    }
    runs++; frames += run.frames.length;
  }
}
const nodes = await json('static-data/nodes.json');
const labels = await json('static-data/labels.json');
assert.equal(nodes.count, index.meta.renderable);
assert.equal(nodes.xyz.length, nodes.count * 3);
assert.equal(new Set(nodes.ids).size, nodes.count);
assert.deepEqual(nodes.ids, labels.rows.map(row => row[0]));
const circuit = await json('static-data/circuit.json');
assert.equal(circuit.nodes.reduce((sum, node) => sum + node.count, 0), index.meta.nodes);
const model = await json('data/flybody-full/model.json');
const bytes = (await stat(new URL('data/flybody-full/model.bin', root))).size;
for (const part of model.parts) {
  for (const [key, width] of [['position', 12], ['index', 4]]) {
    const offset = part[`${key}Offset`], count = part[`${key}Count`];
    assert.ok(offset >= 0 && offset + count * width <= bytes,
      `body ${part.body}: ${key} binary bounds`);
  }
}
console.log(`Verified ${hashes} checksums, ${runs} recordings / ${frames} frames, ${nodes.count} neuron labels, ${model.parts.length} mesh parts.`);
