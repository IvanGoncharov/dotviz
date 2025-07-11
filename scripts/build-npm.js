import fs from 'node:fs';

import packageJSON from '../package.json' with { type: 'json' };
import Viz from '../src/viz.js';
import { spawn, writeGeneratedFile } from './utils.js';

fs.rmSync('lib', { recursive: true, force: true });
fs.mkdirSync('lib');
spawn('docker', ['build', '--progress=plain', '-o', 'lib', 'backend']);

const wasm = fs.readFileSync('lib/module.wasm');
const encoded_js = `const encoded = "${wasm.toString('base64')}";

export function decode() {
  const data = atob(encoded);
  const bytes = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    bytes[i] = data.charCodeAt(i);
  }
  return bytes.buffer;
}
`;
await writeGeneratedFile('lib/encoded.js', encoded_js);

const { default: Module } = await import('../lib/module.mjs');
const viz = new Viz(await Module({ wasm }));
const metadata_js = `export const graphvizVersion = ${JSON.stringify(viz.graphvizVersion)};
export const formats = ${JSON.stringify(viz.formats)};
export const engines = ${JSON.stringify(viz.engines)};
`;
await writeGeneratedFile('lib/metadata.js', metadata_js);

fs.rmSync('npmDist', { recursive: true, force: true });
fs.mkdirSync('npmDist');

fs.copyFileSync('./LICENSE', './npmDist/LICENSE');
fs.copyFileSync('./README.md', './npmDist/README.md');
fs.copyFileSync('./types/index.d.ts', './npmDist/index.d.ts');

spawn('rollup', ['-c']);

delete packageJSON.private;
delete packageJSON.scripts;
delete packageJSON.devDependencies;
packageJSON.main = './viz.js';
packageJSON.exports = {
  types: './index.d.ts',
  require: './viz.cjs',
  default: './viz.js',
};

// Should be done as the last step so only valid packages can be published
await writeGeneratedFile(
  './npmDist/package.json',
  JSON.stringify(packageJSON, undefined, 2),
);
