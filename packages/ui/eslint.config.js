import { config } from '@workspace/eslint-config/react'

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    // Override rules for shadcn component files
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['src/components/vaul/*'],
  },
]
