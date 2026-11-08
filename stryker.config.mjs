// Tests de mutation (StrykerJS) : on modifie exprès le code et on vérifie que les tests le voient.
// Seuil bloquant : 60 % (règle de devAuto pour toutes les applications qu'il construit).
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const configuration = {
  testRunner: 'vitest',
  // Avec pnpm, la recherche automatique ne trouve pas le module : chemin résolu depuis ce paquet
  plugins: [import.meta.resolve('@stryker-mutator/vitest-runner')],
  vitest: { configFile: 'vitest.config.ts' },
  mutate: ['src/projet.ts', 'src/textes.ts', 'src/securite.ts'],
  thresholds: { high: 80, low: 60, break: 60 },
  reporters: ['clear-text', 'progress', 'html'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  tempDirName: '.stryker-tmp',
  cleanTempDir: 'always',
  concurrency: 2,
};

export default configuration;
