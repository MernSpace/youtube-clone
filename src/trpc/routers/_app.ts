import { studioRouter } from '@/modules/studio/server/procedures';
import { createTRPRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
export const appRouter = createTRPRouter({
    studio: studioRouter,
    categories: categoriesRouter,
    videos: videosRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;