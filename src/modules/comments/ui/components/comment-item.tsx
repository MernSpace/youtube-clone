import Link from "next/link";
import {
    CommentGetManyOutput
} from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { error } from "console";
import { toast } from "sonner";

interface CommentItemProps {
    comment: CommentGetManyOutput['items'][number];
};

export const CommentItem = ({ comment }: CommentItemProps) => {
    const { userId } = useAuth()
    const clerk = useClerk()
    const utils = trpc.useUtils();
    const remove = trpc.comments.removeComment.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted")
            utils.comments.getMany.invalidate({ videoId: comment.videoId })
        },
        onError: (error) => {
            toast.error("Something went worng")
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    return (
        <div className="">
            <div className="flex gap-4">
                <Link
                    href={`/users/${comment.userId}`}
                    className=""
                >
                    <UserAvatar
                        size='lg'
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`} className="hover:underline">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user?.name || "Anonymous"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt)}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { }}>
                            <MessageSquareIcon className="size-4 mr-2" />
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};