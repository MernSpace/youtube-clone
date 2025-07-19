"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";;
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { SubscriptionItem, SubscriptionItemSkeleton } from "../components/subscription-item";



export const SubscriptionsSection = () => {
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}


const SubscriptionsSectionSkeleton = () => {
    return (
        <div>

            <div className="flex flex-col gap-4">
                {Array.from({ length: 18 }).map((_, index) => (
                    <SubscriptionItemSkeleton key={index} />
                ))}
            </div>

        </div>
    )
}


const SubscriptionsSectionSuspense = () => {
    const utils = trpc.useUtils()
    const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

    const unSubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            toast.success("Un subscribed")
            utils.subscriptions.getMany.invalidate()
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: data.creatorId })
        },
        onError: () => {
            toast.error("Something went worng")
        }
    })


    return (
        <div >
            <div className="flex flex-col gap-4">
                {subscriptions.pages.flatMap((page) => page.items).map((subscription) => (
                    <Link prefetch key={subscription.creatorId} href={`/users/${subscription.user.id}`}>
                        <SubscriptionItem
                            name={subscription.user.name}
                            imageUrl={subscription.user.imageUrl || "/user-placeholder.svg"}
                            subscriberCount={subscription.user.subscriberCount}
                            onUnsubscribe={() => {
                                unSubscribe.mutate({ userId: subscription.creatorId })
                            }}
                            disabled={unSubscribe.isPending}
                        />
                    </Link>
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