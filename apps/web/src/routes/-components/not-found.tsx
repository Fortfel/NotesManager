import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'

const NotFound = () => {
  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=3050&amp;q=80&amp;exp=-20&amp;con=-15&amp;sat=-75"
        alt=""
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <main className="relative grid place-items-center px-6 pt-6 sm:pt-16 lg:px-8">
        <div className="relative z-10 flex flex-col items-center text-white">
          <p className="text-base font-semibold">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">Page not found</h1>
          <p className="mt-6 text-center text-lg font-medium text-white/70 sm:text-xl/8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>

          <Link
            {...homeLinkOptions}
            className="mt-10 flex w-fit items-center justify-center gap-2 text-base font-semibold hover:text-white/90"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </main>
    </>
  )
}

export { NotFound }
