# Monorepo Reference Guide

## 🏗️ Architecture Overview

This is a **full-stack TypeScript monorepo** built with **Turborepo** for efficient build orchestration and caching.

## 📁 Project Structure

```
├── apps/
│   ├── fastify/          # Backend API (Fastify + tRPC + better-auth)
│   └── web/              # Frontend (React 19 + Vite)
├── packages/
│   ├── api/              # tRPC API definitions & routers
│   ├── auth/             # Better Auth configuration
│   ├── db/               # Drizzle ORM + MySQL
│   ├── i18n/             # Internationalization with Paraglide JS
│   ├── ui/               # Shadcn/ui component library with theming
│   └── validators/       # Zod validation schemas
├── tooling/
│   ├── eslint/           # Shared ESLint configurations
│   ├── prettier/         # Shared Prettier configuration
│   └── typescript/       # Shared TypeScript configurations
└── [config files]
```

## 🚀 Tech Stack

### **Frontend** (`apps/web/`)

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling with dark mode support
- **TanStack Router** for file-based routing
- **TanStack Query** for server state management
- **tRPC** for type-safe API calls
- **Zustand** for client state management
- **Shadcn/ui** components from `@workspace/ui`
- **next-themes** for theme switching
- **Paraglide JS** for internationalization

### **Backend** (`apps/fastify/`)

- **Fastify** web framework
- **tRPC** for type-safe APIs (using `@workspace/api`)
- **TypeScript** with ES modules
- **Node.js Subpath Imports** (`#/*` pattern) for clean internal module resolution
- Security plugins: Helmet, CORS, Rate Limiting, Cookies

### **Database** (`packages/db/`)

- **Drizzle ORM** with MySQL
- **MySQL2** driver with connection pooling
- **Drizzle Kit** for migrations and studio
- **Drizzle Seed** for database seeding

### **Authentication** (`packages/auth/`)

- **Better Auth** with Drizzle adapter
- Schema generation via Better Auth CLI
- Integration with database package

### **Shared Libraries**

- **UI Components** (`packages/ui/`): Shadcn/ui with CVA, Lucide icons, theme support
- **Validators** (`packages/validators/`): Zod schemas
- **API** (`packages/api/`): tRPC definitions & routers
- **Internationalization** (`packages/i18n/`): Paraglide JS for i18n

### **Development Tools**

- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo with intelligent caching
- **Linting**: ESLint with React, TypeScript, and accessibility rules
- **Formatting**: Prettier with Tailwind plugin
- **Type Checking**: TypeScript with strict mode

## 🔧 Key Scripts

### **Root Level Commands**

```bash
# Development
pnpm dev                # Start all apps in development mode (with turbo watch)
pnpm build              # Build all packages and apps
pnpm start              # Start production builds
pnpm lint               # Lint all packages
pnpm lint:fix           # Fix linting issues
pnpm typecheck          # Type check all packages
pnpm format             # Check formatting
pnpm format:fix         # Fix formatting issues

# Database Operations
pnpm db:generate        # Generate Drizzle schema
pnpm db:migrate         # Run database migrations
pnpm db:push            # Push schema to database
pnpm db:seed            # Seed database with test data
pnpm db:studio          # Open Drizzle Studio

# Authentication
pnpm auth:schema:generate # Generate Better Auth schema

# Utilities
pnpm ui-add             # Add Shadcn/ui components to web app
pnpm clean              # Clean all node_modules and build artifacts
pnpm clean:cache        # Clean all cache artifacts
pnpm clean:build        # Clean build artifacts only
pnpm docs               # Generate TypeDoc documentation
```

### **App-Specific Commands**

```bash
# Frontend (apps/web)
turbo dev --filter=web
turbo build --filter=web
pnpm --filter=web ui-add  # Add Shadcn components

# Backend (apps/fastify)
turbo dev --filter=fastify
turbo build --filter=fastify
```

## 🚀 Production Build & Deployment

### **Frontend Deployment (GitHub Pages)**

To deploy the frontend to GitHub Pages:

1. **Set environment variable** - Uncomment/add in `apps/web/.env`:

   ```bash
   PUBLIC_BASE_PATH=/repository-name/
   ```

   Replace `repository-name` with your actual GitHub repository name (case sensitive).

2. **Configure GitHub repository secrets** - Add all required environment variables in:
   - Repository → Settings → Secrets and variables → Actions
   - Add variables like `PUBLIC_SERVER_URL`, `PUBLIC_SERVER_API_PATH`, `PUBLIC_BASE_PATH`, etc.

3. **Configure `.github/workflows/deploy.yml`** - configure the workflow.

4. **Build and deploy** - The Vite build will use the base path for proper asset loading on GitHub Pages.

> **Note:** Remember that GitHub Pages serves static files only. The frontend will need to connect to your separately deployed backend API.

### **Build Configuration**

The backend uses **tsup** for production builds with workspace package bundling:

**Key Configuration (`apps/fastify/tsup.config.ts`):**

```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  sourcemap: false,
  minify: true,

  // Bundle workspace packages but exclude external deps
  noExternal: ['@workspace/api', '@workspace/auth', '@workspace/db', '@workspace/validators'],

  // External dependencies (don't bundle these)
  external: [
    'fastify',
    '@fastify/*',
    'mysql2',
    'drizzle-orm',
    'zod', // ... other deps
  ],

  // Handle TypeScript compilation for workspace packages
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx']
    options.conditions = ['typescript']
  },
})
```

### **Production Build Process**

```bash
# Build backend for production
pnpm --filter=fastify build

# This runs:
# 1. tsup (bundles code + workspace packages)
# 2. create-prod-package.js (creates production package.json)
```

### **Deployment Strategy**

**Simple Deployment Process:**

1. **Build the application:**

   ```bash
   pnpm --filter=fastify build
   ```

2. **Upload to server:**

- Upload entire `apps/fastify/dist/` folder

3. **Install production dependencies:**

   ```bash
   npm install --production
   ```

4. **Start the application:**
   ```bash
   node index.js
   ```

**What gets deployed:**

- Bundled application code (`index.js`)
- Production `package.json` (only external dependencies)
- Environment variables (`.env` file)
- Node modules (installed locally or on server)

**Benefits:**

- Workspace packages are pre-bundled (no monorepo complexity on server)
- Only external dependencies need to be installed
- Single executable file with all internal code
- Environment variables handled via `.env` file

## 📦 Package Dependencies

### **Workspace Dependencies**

- `@workspace/api` - tRPC API definitions & routers
- `@workspace/auth` - Better Auth configuration
- `@workspace/db` - Database client and schemas
- `@workspace/i18n` - Internationalization with Paraglide JS
- `@workspace/ui` - Shared UI components with theming
- `@workspace/validators` - Zod validation schemas
- `@workspace/eslint-config` - ESLint configurations
- `@workspace/typescript-config` - TypeScript configurations
- `@workspace/prettier-config` - Prettier configuration
- `@workspace/tailwind-config` - Tailwind CSS configuration

### **Key External Dependencies**

- **React Ecosystem**: React 19, React DOM, TypeScript types
- **Build Tools**: Vite, Turborepo, TypeScript, ESLint, Prettier
- **Backend**: Fastify, tRPC, Better Auth
- **Database**: Drizzle ORM, MySQL2, Drizzle Kit, Drizzle Seed
- **UI/Styling**: Tailwind CSS v4, Shadcn/ui, CVA, Lucide icons, next-themes
- **Routing**: TanStack Router with devtools
- **State Management**: TanStack Query, Zustand
- **Validation**: Zod
- **Internationalization**: Paraglide JS

## 🔄 Development Workflow

### **Starting Development**

1. Install dependencies: `pnpm install`
2. Set up environment variables (copy `.env.example` files)
3. Generate better-auth schema: `pnpm auth:schema:generate`
4. Generate database schema: `pnpm db:generate`
5. Migrate schema to database: `pnpm db:migrate`
6. Seed database: `pnpm db:seed`
7. Build type declarations in packages: `pnpm build`
8. Start development: `pnpm dev`

### **Adding New Features**

1. **UI Components**: Run `pnpm ui-add` from root (targets web app)
2. **Database Schema**: Modify `packages/db/src/schemas/schema.ts`
3. **API Routes**: Add tRPC routers to `packages/api/src/server/`
4. **Validation**: Add schemas to `packages/validators/src/`
5. **Frontend Pages**: Add routes to `apps/web/src/routes/`
6. **Translations**: Add messages to `packages/i18n/messages/`

### **Database Changes**

1. Modify schema in `packages/db/src/schemas/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate` or `pnpm db:push`
4. Update seed data if needed: `packages/db/src/seed/seed.ts`
5. Regenerate auth schema if needed: `pnpm auth:schema:generate`

## 🎯 Important Notes

### **TypeScript Configuration**

- Uses `"moduleResolution": "Bundler"` with modern bundler-based resolution
- `"allowImportingTsExtensions": true` allows importing `.ts` files directly
- Internal packages use `"emitDeclarationOnly": true` for faster IDE performance
- Strict mode enabled across all packages with additional safety checks
- Shared base configurations in `tooling/typescript/`

### **Node.js Subpath Imports** (Fastify Backend)

The Fastify backend uses **Node.js subpath imports** for clean internal module resolution:

**Package.json Configuration:**

```json
{
  "imports": {
    "#/*.js": "./dist/*.js"
  }
}
```

**TypeScript Configuration:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#/*": ["./src/*"]
    },
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

**Benefits:**

- Clean imports without relative path traversal (`../../../`)
- Consistent import paths regardless of file location
- Maps TypeScript source (`./src/*`) to compiled output (`./dist/*`)
- Standard Node.js feature (no additional tooling required)

### **Database Integration**

- Drizzle ORM with MySQL2 driver
- Better Auth generates auth schema automatically
- Seeding supports both auth tables and custom tables
- Connection pooling configured for production

### **Authentication & Theming**

- **Better Auth** handles user management with Drizzle adapter
- **Schema generation** via CLI: `pnpm auth:schema:generate`
- **Theme system** with next-themes supporting light/dark/system modes
- **Theme persistence** via localStorage with system preference detection
- **Theme toggle** component available in `@workspace/ui`

## 🚨 Common Issues & Solutions

1. **TypeScript Performance**: Internal packages only emit declarations for faster IDE performance. Remember to build them before development.
2. **Drizzle Seed Issues**: Import tables directly, not via re-exports for proper relationship analysis
3. **Better Auth CLI**: Requires direct `betterAuth()` calls for static analysis
4. **Build Errors**: Run `pnpm db:generate` and `pnpm auth:schema:generate` before building
5. **Type Errors**: Ensure all packages are built with `pnpm build`
6. **Production Build**: Must include `noExternal: ['@workspace/*']` in tsup config to bundle workspace packages
7. **Theme Issues**: Ensure Tailwind CSS is configured with `darkMode: 'class'` for theme switching
8. **i18n Setup**: Run paraglide compilation before development for message generation
9. **TypeScript Errors**: Can try to clean node_modules and reinstall/rebuild them (`pnpm clean && pnpm install && pnpm build`)

## 📚 Documentation Links

- [Turborepo Docs](https://turborepo.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://better-auth.com/)
- [Fastify](https://fastify.dev/)
- [tRPC](https://trpc.io/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## Taken inspiration from:

- [rt-stack](https://github.com/nktnet1/rt-stack/tree/551fe2c6adf136f4f8adf04dfa70d88b8cd137e9)
- [t3-turbo](https://github.com/t3-oss/create-t3-turbo/tree/dcf9c001dc853c929a3d467435e297a7480a36e1)
- [Fullstack-SaaS-Boilerplate](https://github.com/alan345/Fullstack-SaaS-Boilerplate/tree/main)

---

_This reference was last updated on 2025-09-20. Keep it updated as the project evolves._
