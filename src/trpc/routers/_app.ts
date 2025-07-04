import { z } from 'zod';
import { baseProcedure, createTRPRouter } from '../init';
import { TRPCError } from '@trpc/server';
export const appRouter = createTRPRouter({
    hello: baseProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {

            return {
                greeting: `hello ${opts.input.text}`,
            };
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;