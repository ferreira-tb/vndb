import config from '@tb-dev/eslint-config';

export default config({
  vue: false,
  project: ['tsconfig.json', 'docs/tsconfig.json', 'test/tsconfig.json'],
  overrides: {
    javascript: {
      'no-constructor-return': 'off'
    },
    typescript: {
      '@typescript-eslint/no-explicit-any': 'off'
    },
    perfectionist: {
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-object-types': 'off'
    }
  }
});
