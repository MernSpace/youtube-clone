import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface VideoMenuPrpos {
    videoId: string;
    variant?: "ghost" | "secondary";
    onRemove?: () => void
}

export const VideoMenu = ({
    videoId,
    variant,
    onRemove
}: VideoMenuPrpos) => {

    const onShare = () => {
        const fullUrl = `http://localhost:3000/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl)
        toast.success("Link copied!")
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size="icon" className="rounded-full">
                    <MoreVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={onShare}>
                    <ShareIcon className="mr-2 size-4" />
                    Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>
                    <ListPlusIcon className="mr-2 size-4" />
                    Add to playlist
                </DropdownMenuItem>

                {onRemove && (
                    <DropdownMenuItem onClick={() => { }}>
                        <Trash2Icon className="mr-2 size-4" />
                        Remove
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}