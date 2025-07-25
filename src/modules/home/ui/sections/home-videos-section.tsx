"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface HomeVideoSectionProps {
    categoryId?: string;
}


export const HomeVideoSection = (props: HomeVideoSectionProps) => {
    return (
        <Suspense key={props.categoryId} fallback={<HomeVideoSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <HomeVideoSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}


const HomeVideoSectionSkeleton = () => {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6">
            {Array.from({ length: 18 }).map((_, index) => (
                <VideoGridCardSkeleton key={index} />
            ))}
        </div>
    )
}


const HomeVideoSectionSuspense = ({
    categoryId
}: HomeVideoSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { categoryId, limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

    return (
        <div >
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5  [@media(min-width:2200px)]:grid-cols-6">
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard key={video.id} data={video} />
                ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}

            />
        </div>
    )
}