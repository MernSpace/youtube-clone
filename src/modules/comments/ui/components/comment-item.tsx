import Link from "next/link";
import {
    CommentGetManyOutput
} from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
    comment: CommentGetManyOutput[number];
};

export const CommentItem = ({ comment }: CommentItemProps) => {
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

            </div>
        </div>
    );
};