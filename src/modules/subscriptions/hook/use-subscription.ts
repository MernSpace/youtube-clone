import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface UseSubscriptionProps {
    userId: string;
    isSubscribed: boolean;
    fromVideoId?: string
}


export const UseSubscription = ({
    userId,
    isSubscribed,
    fromVideoId
}: UseSubscriptionProps) => {

    const clerk = useClerk()
    const utils = trpc.useUtils()

    const subscribe = trpc.subscriptions.create.useMutation({
        onSuccess: () => {
            toast.success("Subscribed")
            utils.subscriptions.getMany.invalidate()
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId })
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId })
            }
        },
        onError: (error) => {
            toast.error("Something went worng")

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    const unSubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: () => {
            toast.success("Un subscribed")
            utils.subscriptions.getMany.invalidate()
            utils.videos.getManySubscribed.invalidate()
            utils.users.getOne.invalidate({ id: userId })

            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId })
            }
        },
        onError: (error) => {
            toast.error("Something went worng")

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })

    const isPanding = subscribe.isPending || unSubscribe.isPending;

    const onClick = () => {
        if (isSubscribed) {
            unSubscribe.mutate({ userId })
        } else {
            subscribe.mutate({ userId })
        }
    }

    return {
        isPanding,
        onClick
    }

}