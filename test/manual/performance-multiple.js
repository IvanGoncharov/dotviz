import { instance } from '../../src/index.js';
import { dotStringify, measure, randomGraph } from './utils.js';

const tests = [
  { nodeCount: 100, randomEdgeCount: 10 },
  { nodeCount: 1000, randomEdgeCount: 50 },
  { nodeCount: 1000, randomEdgeCount: 500 },
  { nodeCount: 1000, randomEdgeCount: 1000 },
];

for (const test of tests) {
  test.input = dotStringify(randomGraph(test.nodeCount, test.randomEdgeCount));
}

const timeLimit = 5000;

for (const { input, nodeCount, randomEdgeCount } of tests) {
  const viz = await instance();
  const result = measure(() => {
    viz.render(input, { format: 'svg' });
    viz.render(input, { format: 'cmapx' });
  }, timeLimit);
  console.log(
    `render, ${nodeCount} nodes, ${randomEdgeCount} edges: ${result}`,
  );
}

for (const { input, nodeCount, randomEdgeCount } of tests) {
  const viz = await instance();
  const result = measure(() => {
    viz.renderFormats(input, ['svg', 'cmapx']);
  }, timeLimit);
  console.log(
    `renderFormats, ${nodeCount} nodes, ${randomEdgeCount} edges: ${result}`,
  );
}
