// Analyse du code (socle de devAuto, D-031, D-074) : règles strictes par les types, sécurité,
// performance de Next.js et accessibilité (jeu « strict »). Toute remarque bloque la CI.
import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import security from 'eslint-plugin-security';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '.next/**',
      'next-env.d.ts',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'reports/**',
      '.stryker-tmp/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Jamais de texte exécuté comme du code
      'no-eval': 'error',
      'no-new-func': 'error',
    },
  },
  security.configs.recommended,
  nextVitals,
  { files: ['**/*.tsx'], rules: jsxA11y.flatConfigs.strict.rules },
  { files: ['**/*.mjs', '**/*.js'], extends: [tseslint.configs.disableTypeChecked] },
  // Toujours en dernier : laisse la mise en forme à Prettier
  prettier,
);
