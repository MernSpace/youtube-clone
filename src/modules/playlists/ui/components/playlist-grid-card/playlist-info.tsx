import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistGetManyOutput } from "@/modules/playlists/types";

interface PlayListInfoProps {
    data: PlaylistGetManyOutput["items"][number];
};

export const PlaylistInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-[90%]" />
                <Skeleton className="h-5 w-[70%]" />
                <Skeleton className="h-5 w-[50%]" />
            </div>
        </div>
    )
}



export const PlayListInfo = ({ data }: PlayListInfoProps) => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-1 lg:line-clamp-2 text-sm font-medium break-words">
                    {data.name}
                </h3>
                <p className="text-sm text-muted-foreground">Playlist</p>
                <p className="text-sm text-muted-foreground font-semibold hover:text-primary">View full playlist</p>
            </div>
        </div>
    );
};