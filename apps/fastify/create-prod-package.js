import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

// Read the pnpm-workspace.yaml catalog
function getCatalogVersions() {
  const workspaceContent = readFileSync('../../pnpm-workspace.yaml', 'utf8')
  const catalog = {}

  // Simple parser for catalog entries
  const lines = workspaceContent.split('\n')
  let inCatalog = false

  for (const line of lines) {
    if (line.startsWith('catalog:')) {
      inCatalog = true
      continue
    }
    if (inCatalog && line.trim() && !line.startsWith(' ')) {
      break
    }
    if (inCatalog && line.includes(':')) {
      const match = line.match(/^\s+['"]?([^'":\s]+)['"]?\s*:\s*(.+)$/)
      if (match) {
        catalog[match[1]] = match[2].trim()
      }
    }
  }

  return catalog
}

// Function to collect all dependencies from workspace packages
function collectWorkspaceDependencies(catalog) {
  const workspacePackages = [
    '../../packages/api/package.json',
    '../../packages/auth/package.json',
    '../../packages/db/package.json',
    '../../packages/validators/package.json',
  ]

  const allDeps = {}

  for (const pkgPath of workspacePackages) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      const deps = pkg.dependencies || {}

      for (const [name, version] of Object.entries(deps)) {
        if (!name.startsWith('@workspace/')) {
          // Resolve catalog: references
          if (version === 'catalog:') {
            allDeps[name] = catalog[name] || version
          } else {
            allDeps[name] = version
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read ${pkgPath}`)
    }
  }

  return allDeps
}

// Get catalog versions
const catalog = getCatalogVersions()

// Collect workspace dependencies with resolved versions
const workspaceDeps = collectWorkspaceDependencies(catalog)

// Create production package.json with resolved versions
const prodPackageJson = {
  name: 'fastify',
  private: true,
  version: '0.0.0',
  type: 'module',
  scripts: {
    start: 'node index.js',
  },
  dependencies: {
    // Resolve catalog versions to actual versions
    '@fastify/cookie': catalog['@fastify/cookie'],
    '@fastify/cors': catalog['@fastify/cors'],
    '@fastify/helmet': catalog['@fastify/helmet'],
    '@fastify/rate-limit': catalog['@fastify/rate-limit'],
    '@t3-oss/env-core': catalog['@t3-oss/env-core'],
    fastify: catalog['fastify'],
    zod: catalog['zod'],

    // Auto-discovered workspace dependencies (already resolved)
    ...workspaceDeps,
  },
}

try {
  writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2))
  console.log('✅ Production package.json created!')
  console.log('📋 All dependencies resolved from catalog')

  // Copy env file
  copyFileSync('.env', 'dist/.env')
  console.log('✅ Env file copied!')

  console.log('\n🚀 Production build complete!')
  console.log('📦 Deploy the entire dist/ folder to your server')
  console.log('🔧 On server: npm install --production && npm start')
} catch (error) {
  console.error('❌ Failed to create production files:', error)
  process.exit(1)
}
