import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_app/_protected/settings&quot;!</div>
}
