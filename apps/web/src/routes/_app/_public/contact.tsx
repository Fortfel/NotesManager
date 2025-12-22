import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_public/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &quot;/_app/_public/contsct&quot;!</div>
}
