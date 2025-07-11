import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

import packageJSON from './package.json' with { type: 'json' };

const banner = `/*!
dotviz ${packageJSON.version}

This distribution contains other software in object code form:
Graphviz https://www.graphviz.org
Expat https://libexpat.github.io
*/`;

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'npmDist/viz.js',
      format: 'es',
      banner,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        ignore: ['./lib/encoded.js'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'npmDist/viz.cjs',
      format: 'cjs',
      banner,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        ignore: ['./lib/encoded.js'],
      }),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'Viz',
      file: 'npmDist/viz-global.js',
      format: 'umd',
      banner,
      plugins: [terser()],
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        ignore: ['./lib/encoded.js'],
      }),
    ],
  },
];
