import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { loginLinkOptions } from '@/routes/_auth/-validations/auth-link-options'

export const Route = createFileRoute('/_auth/auth/error')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-muted flex h-screen items-center justify-center">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive text-2xl font-semibold">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="flex flex-col gap-6">
            <p>
              We encountered an issue while processing your request. Please try again or contact the application owner
              if the problem persists.
            </p>
            <div className="flex gap-6">
              <Link {...loginLinkOptions} className="flex-1">
                <Button variant="primary" className="w-full">
                  Try again
                </Button>
              </Link>
              <Link {...homeLinkOptions} className="flex-1">
                <Button variant="primary" className="w-full">
                  Return to Application
                </Button>
              </Link>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
