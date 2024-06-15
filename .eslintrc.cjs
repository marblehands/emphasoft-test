module.exports = {
  env: {
    browser: true,
    es2021: true,
    'cypress/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:cypress/recommended', 'airbnb-base', 'plugin:import/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['cypress', 'import'],
  root: true,
  rules: {},
};
