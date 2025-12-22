/// <reference types="./types.d.ts" />

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import turboConfig from 'eslint-config-turbo/flat'
import eslintPluginDrizzle from 'eslint-plugin-drizzle'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginTsdoc from 'eslint-plugin-tsdoc'
import turboPlugin from 'eslint-plugin-turbo'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import { globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

/**
 * All packages that leverage t3-env should use this rule
 */
export const restrictEnvAccess = tseslint.config({
  files: ['**/*.js', '**/*.ts', '**/*.tsx'],
  ignores: ['**/env.ts'], // Only ignore env.ts files for these specific rules
  rules: {
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message: "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        name: 'process',
        importNames: ['env'],
        message: "Use `import { env } from '@/env'` instead to ensure validated types.",
      },
    ],
  },
})

/**
 * A shared ESLint configuration for the repository.
 */
export const config = tseslint.config(
  // Global ignores
  globalIgnores(['dist']),

  // Base configs for all files
  restrictEnvAccess,
  js.configs.recommended,
  ...turboConfig,
  eslintConfigPrettier,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginUnicorn.configs.recommended,

  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  // Global rule overrides
  {
    rules: {
      ...turboPlugin.configs.recommended.rules,
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/catch-error-name': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },

  // JavaScript files - NO type-aware rules
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },

  // TypeScript files - WITH type-aware rules
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.stylisticTypeChecked, ...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true, // Only for TypeScript files
      },
    },
    plugins: {
      tsdoc: eslintPluginTsdoc,
      drizzle: eslintPluginDrizzle,
      turbo: turboPlugin,
    },
    rules: {
      ...eslintPluginDrizzle.configs.recommended.rules,
      'drizzle/enforce-delete-with-where': [
        'error',
        {
          drizzleObjectName: 'db',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],

      'no-restricted-syntax': [
        'error',
        // Ban all enums:
        {
          selector: 'TSEnumDeclaration',
          message:
            'Use const assertion or a string union type instead. https://mkosir.github.io/typescript-style-guide/#enums--const-assertion',
        },
      ],
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'are', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          // Generic type parameter must start with letter T, followed by any uppercase letter.
          selector: 'typeParameter',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true,
          },
        },
      ],
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            {
              from: 'package',
              package: '@tanstack/router-core',
              name: 'Redirect',
            },
          ],
        },
      ],
      'tsdoc/syntax': 'warn',
    },
  },
  {
    // Override for specific files
    // files: ['src/assets/**/*', 'server/**/*'],
    // rules: {
    //   'import/no-default-export': 'off',
    // },
  },
)
