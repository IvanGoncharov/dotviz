// eslint-disable-next-line import-x/no-unresolved
import { instance } from 'dotviz';

instance().then((viz) => console.log(viz.renderString('digraph { a -> b }')));
