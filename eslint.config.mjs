import { getEsLintConfigs } from '@gmjs/eslint-config';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  {
    ignores: [
      'dist/',
      'eslint.config.mjs',
      'jest.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.ts',
      'publish.js',
    ],
  },
  ...getEsLintConfigs({ projectType: 'node' }),
];
