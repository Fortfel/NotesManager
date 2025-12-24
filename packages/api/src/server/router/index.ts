import { createTRPCRouter } from '../trpc'
import { authRouter } from './auth'
import { noteRouter } from './notes'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  notes: noteRouter,
})
