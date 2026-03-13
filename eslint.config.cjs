const globals = require('globals');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '**/*.min.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      // ES6 features
      'arrow-spacing': ['error', { before: true, after: true }],
      'prefer-const': ['error'],
      'no-var': ['error'],
      
      // Style
      'camelcase': ['error', { properties: 'always' }],
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': ['error', { code: 200 }],
      
      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['error'],
      'no-undef': ['error'],
      'curly': ['error'],
      'eqeqeq': ['error'],
      
      // Import
      'import/extensions': ['error', 'ignorePackages'],
    },
  },
];
