import { instance } from '../../src/index.js';
import { dotStringify, measure, randomGraph } from './utils.js';

const tests = [
  { nodeCount: 100, randomEdgeCount: 0 },
  { nodeCount: 1000, randomEdgeCount: 0 },
  { nodeCount: 5000, randomEdgeCount: 0 },
  { nodeCount: 100, randomEdgeCount: 50 },
  { nodeCount: 1000, randomEdgeCount: 500 },
  { nodeCount: 5000, randomEdgeCount: 1000 },
  { nodeCount: 100, randomEdgeCount: 100 },
  { nodeCount: 100, randomEdgeCount: 200 },
  { nodeCount: 100, randomEdgeCount: 300 },
];

for (const test of tests) {
  test.input = dotStringify(randomGraph(test.nodeCount, test.randomEdgeCount));
}

const timeLimit = 5000;

for (const { input, nodeCount, randomEdgeCount } of tests) {
  const viz = await instance();
  const result = measure(() => viz.render(input), timeLimit);
  console.log(`${nodeCount} nodes, ${randomEdgeCount} edges: ${result}`);
}
