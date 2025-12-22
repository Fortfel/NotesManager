import { config } from '@workspace/eslint-config/vite-react'

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['**/routeTree.gen.ts'],
  },
  // Specific override for vite.config.ts to use node config
  {
    files: ['vite.config.ts'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.node.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
        },
      },
    },
  },
]
