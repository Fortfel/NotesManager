import type * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_public/about')({
  component: AboutComponent,
  head: () => ({
    meta: [
      {
        title: 'About',
      },
    ],
  }),
})

function AboutComponent(): React.JSX.Element {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">About</h1>

        <div className="prose max-w-none">
          <p className="mb-4 text-gray-600">
            This is a modern full-stack TypeScript monorepo built with cutting-edge technologies.
          </p>

          <h2 className="mb-3 text-xl font-semibold text-gray-900">Tech Stack</h2>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">Frontend</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• React 19 with TypeScript</li>
                <li>• TanStack Router for routing</li>
                <li>• TanStack Query for data fetching</li>
                <li>• Vite for build tooling</li>
                <li>• Tailwind CSS for styling</li>
              </ul>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">Backend</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Fastify web framework</li>
                <li>• tRPC for type-safe APIs</li>
                <li>• Better Auth for authentication</li>
                <li>• Drizzle ORM with MySQL</li>
                <li>• Turborepo for monorepo management</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600">
            This setup provides a robust foundation for building modern web applications with type safety, excellent
            developer experience, and production-ready architecture.
          </p>
        </div>
      </div>
    </div>
  )
}
