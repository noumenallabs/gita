module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
  rules: {
    'no-duplicate-imports': 'error',
    'no-redeclare': 'error',
    'no-unused-vars': 'off', // Using TypeScript's no-unused-vars
    '@typescript-eslint/no-unused-vars': 'error',
    'no-undef': 'off', // TypeScript handles this
    semi: 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/react-in-jsx-scope': 'off', // Not needed in React 19
    'react/prop-types': 'off', // Using TypeScript
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    'react-native/react-native': true,
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'web-build/',
    '**/__tests__/**',
    '**/*.test.ts',
    '**/*.test.tsx',
    'scripts/**/*.js',
    'tailwind.config.js',
    'metro.config.js',
  ],
};
