// eslint-disable-next-line import-x/no-unresolved
import { instance } from 'dotviz';

const viz = await instance();
console.log(viz.renderString('digraph { a -> b }'));
