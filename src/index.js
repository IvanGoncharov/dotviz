import { decode } from '../lib/encoded.js';
import Module from '../lib/module.mjs';
import Viz from './viz.js';

export { engines, formats, graphvizVersion } from '../lib/metadata.js';

export function instance() {
  return Module({ wasm: decode() }).then((m) => new Viz(m));
}
