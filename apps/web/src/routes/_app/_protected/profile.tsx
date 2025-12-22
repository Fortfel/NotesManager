import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_app/_protected/profile&quot;!</div>
}
