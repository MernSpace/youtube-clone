import { db } from '@/db';
import { videoReactions } from '@/db/schema';
import { createTRPRouter, protectedProcedure } from '@/trpc/init'
import { and, eq } from 'drizzle-orm';
import z from 'zod'
export const videoReactionsRouter = createTRPRouter({
    like: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id: userId } = ctx.user
            const [existingVideoReactionLike] = await db
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.type, "like")
                    )
                )
            if (existingVideoReactionLike) {
                const [deleteViewerReaction] = await db
                    .delete(videoReactions)
                    .where(and(
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.videoId, videoId)
                    ))
                    .returning()
                return deleteViewerReaction;
            }

            const [createVideoReaction] = await db
                .insert(videoReactions)
                .values({ userId, videoId, type: "like" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type: "like"
                    }
                })
                .returning()
            return createVideoReaction;
        }),

    dislike: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id: userId } = ctx.user
            const [existingVideoReactionDisLike] = await db
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.type, "dislike")
                    )
                )
            if (existingVideoReactionDisLike) {
                const [deleteViewerReaction] = await db
                    .delete(videoReactions)
                    .where(and(
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.videoId, videoId)
                    ))
                    .returning()
                return deleteViewerReaction;
            }

            const [createVideoReaction] = await db
                .insert(videoReactions)
                .values({ userId, videoId, type: "dislike" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type: "dislike"
                    }
                })
                .returning()
            return createVideoReaction;
        })
})