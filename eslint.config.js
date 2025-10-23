import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node
    },
    plugins: {
      import: importPlugin,
      unicorn: eslintPluginUnicorn,
      '@stylistic/ts': stylisticTs,
      'unused-imports': unusedImports
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      // '@typescript-eslint/consistent-type-imports': [
      //   'error',
      //   {
      //     prefer: 'type-imports',
      //     disallowTypeAnnotations: false,
      //     fixStyle: 'inline-type-imports'
      //   }
      // ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'const', next: 'return' }
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type'
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },
          'newlines-between': 'always-and-inside-groups',
          named: {
            import: true,
            export: true,
            require: false,
            cjsExports: false,
            types: 'types-first'
          }
        }
      ]
    }
  }
)
