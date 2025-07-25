import { DEFAULT_LIMIT } from "@/constants";

import { HydrateClient, trpc } from "@/trpc/server";
import { VideosView } from "../../../../modules/playlists/ui/views/videos-view";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ playlistId: string }>
}
const Page = async ({ params }: PageProps) => {
    const { playlistId } = await params;

    void trpc.playlists.getOne.prefetch({ id: playlistId })
    void trpc.playlists.getVideo.prefetchInfinite({ playlistId, limit: DEFAULT_LIMIT })
    return (
        <HydrateClient>
            <VideosView playlistId={playlistId} />
        </HydrateClient>
    )
}


export default Page;