module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          'simple-import-sort/exports': 'error',
          '@typescript-eslint/no-shadow': ['error'],
          'no-shadow': 'off',
          'no-undef': 'off',
          '@typescript-eslint/no-unused-vars': [
            'error',
            {varsIgnorePattern: '^_'},
          ],
        },
      },
    ],
  };
  