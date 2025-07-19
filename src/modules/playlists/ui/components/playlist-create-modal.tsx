import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

interface PlayListCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const PlayListCreateModal = ({
    open,
    onOpenChange,
}: PlayListCreateModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });
    const ulits = trpc.useUtils()
    const create = trpc.playlists.create.useMutation({
        onSuccess: () => {
            ulits.playlists.getMany.invalidate()
            form.reset();
            onOpenChange(false);
            toast.success("Playlist created");
        },
        onError: () => {
            toast.error("Something went wrong");
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        create.mutate(values);
    };

    return (
        <ResponsiveModal
            title="Create a playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter playlist name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            disabled={create.isPending}
                            type="submit"
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
};