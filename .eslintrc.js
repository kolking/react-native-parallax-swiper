module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['/coverage/*'],
};
