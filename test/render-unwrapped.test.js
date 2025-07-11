import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { JSDOM } from 'jsdom';

import * as VizPackage from '../src/index.js';

describe('Viz', function () {
  let viz;

  beforeEach(async function () {
    viz = await VizPackage.instance();
  });

  describe('renderString', function () {
    it('returns the output for the first graph, even if subsequent graphs have errors', function () {
      const result = viz.renderString('graph a { } graph {');

      assert.strictEqual(
        result,
        'graph a {\n\tgraph [bb="0,0,0,0"];\n\tnode [label="\\N"];\n}\n',
      );
    });

    it('throws an error if the first graph has a syntax error', function () {
      assert.throws(() => viz.renderString('graph {'), {
        name: 'Error',
        message: 'syntax error in line 1',
      });
    });

    it('throws an error for layout errors', function () {
      assert.throws(() => viz.renderString('graph { layout=invalid }'), {
        name: 'Error',
        message:
          'Layout type: "invalid" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi',
      });
    });

    it('throws an error if there are no graphs in the input', function () {
      assert.throws(() => viz.renderString(''), {
        name: 'Error',
        message: 'render failed',
      });
    });

    it('throws an error with the first render error message', function () {
      assert.throws(
        () => viz.renderString('graph { layout=invalid; x=1.2.3=y }'),
        {
          name: 'Error',
          message:
            'Layout type: "invalid" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi',
        },
      );
    });

    it('throws for invalid format option', function () {
      assert.throws(
        () => viz.renderString('graph { }', { format: 'invalid' }),
        {
          name: 'Error',
          message:
            'Format: "invalid" not recognized. Use one of: canon cmap cmapx cmapx_np dot dot_json eps fig gv imap imap_np ismap json json0 pic plain plain-ext pov ps ps2 svg svg_inline tk xdot xdot1.2 xdot1.4 xdot_json',
        },
      );
    });

    it('throws for invalid engine option', function () {
      assert.throws(
        () => viz.renderString('graph { }', { engine: 'invalid' }),
        {
          name: 'Error',
          message:
            'Layout type: "invalid" not recognized. Use one of: circo dot fdp neato nop nop1 nop2 osage patchwork sfdp twopi',
        },
      );
    });

    it('accepts a non-ASCII character', function () {
      assert.match(viz.renderString('digraph { a [label=図] }'), /label=図/);
    });

    it('a graph with unterminated string followed by another call with a valid graph', function () {
      assert.throws(() => viz.renderString('graph { a[label="blah'), {
        name: 'Error',
        message:
          // cspell:disable-next-line
          'syntax error in line 1 scanning a quoted string (missing endquote? longer than 16384?)\nString starting:"blah',
      });
      assert.ok(viz.renderString('graph { a }'));
    });
  });

  describe('renderSVGElement', function () {
    it('returns an SVG element', function () {
      try {
        const window = new JSDOM().window;
        globalThis.DOMParser = window.DOMParser;

        const svg = viz.renderSVGElement('digraph { a -> b }');
        assert.deepStrictEqual(
          svg.querySelector('.node title').textContent,
          'a',
        );
        assert.deepStrictEqual(
          svg.querySelector('.edge title').textContent,
          'a->b',
        );
      } finally {
        delete globalThis.DOMParser;
      }
    });

    it('throws an error for syntax errors', function () {
      assert.throws(() => viz.renderSVGElement(`graph {`), {
        name: 'Error',
        message: 'syntax error in line 1',
      });
    });

    it('throws an error if there are no graphs in the input', function () {
      assert.throws(() => viz.renderSVGElement(''), {
        name: 'Error',
        message: 'render failed',
      });
    });
  });

  describe('renderJSON', function () {
    it('returns an object', function () {
      assert.deepStrictEqual(viz.renderJSON('digraph a { }').name, 'a');
    });

    it('throws an error for syntax errors', function () {
      assert.throws(() => viz.renderJSON(`graph {`), {
        name: 'Error',
        message: 'syntax error in line 1',
      });
    });

    it('throws an error if there are no graphs in the input', function () {
      assert.throws(() => viz.renderJSON(''), {
        name: 'Error',
        message: 'render failed',
      });
    });
  });
});
