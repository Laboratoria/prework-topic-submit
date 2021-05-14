module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
