
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

export const PlaylistAddModal = ({
    open,
    onOpenChange,
    videoId
}: PlaylistAddModalProps) => {


    const {
        data,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = trpc.playlists.getManyForVideo.useInfiniteQuery({
        limit: DEFAULT_LIMIT,
        videoId
    }, { getNextPageParam: (lastPage) => lastPage.nextCursor, enabled: !!videoId && open })

    const utils = trpc.useUtils()
    const addVideo = trpc.playlists.addVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video added to playlist")
            utils.playlists.getMany.invalidate();
            utils.playlists.getManyForVideo.invalidate({ videoId })

            utils.playlists.getOne.invalidate({ id: data.playlistId })
            utils.playlists.getVideo.invalidate({ playlistId: data.playlistId })
        },
        onError: () => {
            toast.error("Something went worng")
        }
    })


    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success("Video removed from playlist")
            utils.playlists.getMany.invalidate();
            utils.playlists.getManyForVideo.invalidate({ videoId })
            utils.playlists.getOne.invalidate({ id: data.playlistId })
            utils.playlists.getVideo.invalidate({ playlistId: data.playlistId })
        },
        onError: () => {
            toast.error("Something went worng")
        }
    })


    return (
        <ResponsiveModal
            title="Add to playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="flex flex-col gap-2">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className=" size-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading &&
                    data?.pages
                        .flatMap((page) => page.items)
                        .map((playlist) => (
                            <Button
                                key={playlist.id}
                                className="w-full justify-start px-2 [&_svg]:h-5"
                                variant="ghost"
                                size="lg"
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({ playlistId: playlist.id, videoId })
                                    } else {
                                        addVideo.mutate({ playlistId: playlist.id, videoId })
                                    }
                                }}
                                disabled={removeVideo.isPending || addVideo.isPending}
                            >
                                {playlist.containsVideo ? (
                                    <SquareCheckIcon className="mr-2" />
                                ) : (
                                    <SquareIcon className="mr-2" />
                                )}
                                {playlist.name}
                            </Button>
                        ))
                }
                {!isLoading && (
                    <InfiniteScroll
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        isManual
                    />
                )}

            </div>

        </ResponsiveModal>
    );
};