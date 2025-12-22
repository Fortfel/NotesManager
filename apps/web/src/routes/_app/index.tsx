import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'

export const Route = createFileRoute('/_app/')({
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const [count, setCount] = React.useState(0)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="rounded-lg border-4 border-dashed border-gray-200 p-8">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">Vite + React + TanStack Router</h1>

          <div className="h-[1000px] space-y-4">
            <div className="rounded-lg p-6 shadow">
              <Button variant="outline" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="outline-ghost" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="secondary-outline" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="info-ghost" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="success-ghost" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="warning-ghost" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <Button variant="destructive-ghost" onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </Button>
              <p className="mt-4 text-gray-600">
                Edit <code className="rounded px-2 py-1">src/routes/index.tsx</code> and save to test HMR
              </p>
            </div>

            <div className="rounded-lg p-6 shadow">
              <h2 className="mb-2 text-xl font-semibold">🚀 Features Enabled</h2>
              <ul className="space-y-1 text-left text-gray-600">
                <li>✅ TanStack Router with file-based routing</li>
                <li>✅ TanStack Query for data fetching</li>
                <li>✅ tRPC for type-safe APIs</li>
                <li>✅ Better Auth for authentication</li>
                <li>✅ Tailwind CSS for styling</li>
              </ul>
            </div>
          </div>

          <p className="mt-8 text-gray-500">Click on the Vite and React logos to learn more</p>
        </div>
      </div>
    </div>
  )
}
