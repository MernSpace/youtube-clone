import { studioRouter } from '@/modules/studio/server/procedures';
import { createTRPRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { subscriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { commentsRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { suggestionsRouter } from '@/modules/suggestions/server/procedures';
import { searchRouter } from '@/modules/search/server/procedures';
export const appRouter = createTRPRouter({
    studio: studioRouter,
    search: searchRouter,
    categories: categoriesRouter,
    videos: videosRouter,
    comments: commentsRouter,
    videoViews: videoViewsRouter,
    videoReactions: videoReactionsRouter,
    commentReactions: commentReactionsRouter,
    subscriptions: subscriptionsRouter,
    suggestions: suggestionsRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;