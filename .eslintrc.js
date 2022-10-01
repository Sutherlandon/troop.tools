module.exports = {
  extends: [
    'standard',
    'next/core-web-vitals',
  ],
  rules: {
    semi: [2, 'always'],
    'comma-dangle': ['error', {
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'never',
    }],
    'space-before-function-paren': 'off',
    'multiline-ternary': 'off',
  },
};
