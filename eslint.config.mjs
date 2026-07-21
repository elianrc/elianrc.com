import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', '.astro/**', '.next/**', 'out/**', 'node_modules/**'],
  },
  {
    files: ['functions/**/*.js'],
    languageOptions: {
      globals: {
        fetch: 'readonly',
        Response: 'readonly',
      },
    },
  },
]
