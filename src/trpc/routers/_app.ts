import { createTRPRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
export const appRouter = createTRPRouter({

    categories: categoriesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;