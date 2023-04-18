module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    '@react-native-community',
  ],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest',
  },
  'rules': {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'no-redeclare': 'off',
  },
}
