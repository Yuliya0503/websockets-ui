module.exports = {
  env: {
    node: true,
    jest: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  parserOptions: {
    tsconfigRootDir : __dirname,
    sourceType: 'module'
  },
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        'endOfLine': 'auto'
      }
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}