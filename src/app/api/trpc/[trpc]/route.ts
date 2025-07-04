import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContex } from '@/trpc/init'
import { appRouter } from '@/trpc/routers/_app'


const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: createTRPCContex
    })
export { handler as GET, handler as POST } 