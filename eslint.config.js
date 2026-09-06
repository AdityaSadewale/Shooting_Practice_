import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'scripts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
<<<<<<< HEAD
      'no-unused-vars': ['error', { varsIgnorePattern: '^(motion|[A-Z_])' }],
=======
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|motion' }],
>>>>>>> b434b554a09d0eedfdd080bbb1e4b51a1ae0e8e8
    },
  },
])
