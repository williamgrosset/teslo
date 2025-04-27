import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
const { configs: tsConfigs } = tsPlugin

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsConfigs.recommended.rules
    }
  }
]
