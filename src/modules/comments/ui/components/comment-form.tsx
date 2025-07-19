import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface CommentFormProps {
    videoId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    parentId?: string;
    variant?: "comment" | "reply";
}

// Create form-specific schema by omitting userId
const commentFormSchema = commentInsertSchema.omit({ userId: true });

export const CommentForm = ({
    videoId,
    onSuccess,
    parentId,
    variant = "comment",
    onCancel
}: CommentFormProps) => {
    const { user } = useUser();
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const form = useForm<z.infer<typeof commentFormSchema>>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            parentId: parentId,
            videoId,
            value: ""
        }
    });

    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            if (parentId) {
                utils.comments.getMany.invalidate({ videoId, parentId });
            }
            form.reset();
            toast.success(variant === "reply" ? "Reply added" : "Comment added");
            onSuccess?.();
        },
        onError: (error) => {
            toast.error("Something went wrong");
            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });

    const handleSubmit = (values: z.infer<typeof commentFormSchema>) => {
        if (!user?.id) {
            clerk.openSignIn();
            return;
        }

        // Create the full payload with userId
        const fullPayload: z.infer<typeof commentInsertSchema> = {
            ...values,
            userId: user.id
        };

        create.mutate(fullPayload);
    };

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 group">
                <UserAvatar
                    size="lg"
                    imageUrl={user?.imageUrl || "/user-placeholder.svg"}
                    name={user?.username || "user"}
                />
                <div className="flex-1">
                    <FormField
                        name="value"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={
                                            variant === "reply"
                                                ? "Reply to this comment"
                                                : "Add a comment..."
                                        }
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={handleCancel}
                                disabled={create.isPending}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            disabled={create.isPending || !form.watch("value")}
                            type="submit"
                            size="sm"
                        >
                            {variant === "reply" ? "Reply" : "Comment"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};