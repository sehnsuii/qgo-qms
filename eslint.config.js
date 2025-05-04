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
  {
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginReact.configs.flat.recommended,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-undef': 'off',
    },
  },
]);
