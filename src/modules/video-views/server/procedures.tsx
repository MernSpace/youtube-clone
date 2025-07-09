import { db } from '@/db';
import { videoViews } from '@/db/schema';
import { createTRPRouter, protectedProcedure } from '@/trpc/init'
import { and, eq } from 'drizzle-orm';
import z from 'zod'
export const videoViewsRouter = createTRPRouter({
    create: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id: userId } = ctx.user
            const [existingVideoView] = await db
                .select()
                .from(videoViews)
                .where(
                    and(
                        eq(videoViews.videoId, videoId),
                        eq(videoViews.userId, userId)
                    )
                )
            if (existingVideoView) {
                return existingVideoView
            }

            const [createVideoView] = await db
                .insert(videoViews)
                .values({ userId, videoId })
                .returning()
            return createVideoView
        })
})