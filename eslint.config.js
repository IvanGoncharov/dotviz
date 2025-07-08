import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['npmDist/', 'lib/'],
  },
  {
    linterOptions: {
      noInlineConfig: false,
      reportUnusedInlineConfigs: 'error',
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: { globals: globals['shared-node-browser'] },
    extends: ['js/recommended'],
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals['browser'] },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals['node'] },
  },
  {
    files: ['**/*.json'],
    ignores: ['**/package-lock.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
]);
