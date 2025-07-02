import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { readFile } from 'node:fs/promises';

async function getBanner() {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  const packageVersion = JSON.parse(contents).version;

  return `/*!
dotviz ${packageVersion}

This distribution contains other software in object code form:
Graphviz https://www.graphviz.org
Expat https://libexpat.github.io
*/`;
}

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'npmDist/viz.js',
      format: 'es',
      banner: getBanner,
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
      banner: getBanner,
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
      banner: getBanner,
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
