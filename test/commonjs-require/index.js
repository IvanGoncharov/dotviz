//FIXME once enable integration tests
/* eslint-disable no-undef */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable unicorn/prefer-top-level-await */
const { instance } = require('@viz-js/viz');

instance().then((viz) => console.log(viz.renderString('digraph { a -> b }')));
