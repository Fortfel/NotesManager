import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react'
import { Link, useLocation, useMatches, useNavigate, useRouter } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import { authClient } from '@/lib/auth-client'
import { homeLinkOptions, profileLinkOptions, settingsLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { loginLinkOptions } from '@/routes/_auth/-validations/auth-link-options'

const NavUser = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  const isProtectedRoute = matches.some((match) => match.routeId.includes('/_protected'))

  if (isSessionPending)
    return (
      <>
        <CircleSpinner size={'sm'} />
      </>
    )

  return (
    <>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage referrerPolicy="no-referrer" src={session.user.image ?? ''} alt={session.user.name} />
              <AvatarFallback className="text-sm">
                {(session.user.name.split(' ')[0]?.[0] ?? '') + (session.user.name.split(' ')[1]?.[0] ?? '')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={5} className="w-[250px] rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col items-start text-sm leading-tight">
                  <span className="truncate font-medium">{session.user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{session.user.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => void navigate(profileLinkOptions)} className="cursor-pointer">
                <IconUser /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void navigate(settingsLinkOptions)} className="cursor-pointer">
                <IconSettings /> Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  void authClient.signOut().then(() => {
                    if (isProtectedRoute) {
                      void navigate({ ...homeLinkOptions, replace: true })
                    }
                    void router.invalidate()
                  })
                }}
                className="cursor-pointer"
              >
                <IconLogout /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="primary" asChild size={'sm'} className="max-lg:ml-1 max-lg:px-2">
          <Link {...loginLinkOptions} search={{ redirect: location.href }} mask={loginLinkOptions}>
            Login
          </Link>
        </Button>
      )}
    </>
  )
}

export { NavUser }
