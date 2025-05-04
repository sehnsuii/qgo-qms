import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    ignores: [
      'vendor/**',
      'node_modules/**',
      'bootstrap/cache/**',
      'storage/**',
      'public/build/**',
      'public/hot/**',
      'public/storage/**',
      'resources/views/vendor/**',
      'database/migrations/**',
      '*.blade.php',
    ],
  },
  { settings: { react: { version: 'detect' } } },
  { files: ['**/*.{js,mjs,cjs,jsx}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,jsx}'], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettier,
]);
