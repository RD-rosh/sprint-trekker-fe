'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { auth } from '@/lib/firebase';

const issueSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
    assignee: z.string().optional(),
});

type IssueForm = z.infer<typeof issueSchema>;

interface CreateIssueDrawerProps {
    projectId: string;
    onIssueCreated?: () => void;
    defaultStatus?: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
    trigger?: React.ReactNode;
}

export default function CreateIssueDrawer({ projectId, onIssueCreated, defaultStatus, trigger }: CreateIssueDrawerProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            priority: 'MEDIUM',
            status: defaultStatus || 'TODO',
        },
    });

    const statusValue = watch('status');
    const priorityValue = watch('priority');

    // Reset form when drawer opens
    useEffect(() => {
        if (open) {
            reset({
                title: '',
                description: '',
                priority: 'MEDIUM',
                status: defaultStatus || 'TODO',
            });
        }
    }, [open, defaultStatus, reset]);

    const onSubmit = async (data: IssueForm) => {
        setLoading(true);

        try {
            const token = await auth.currentUser?.getIdToken();

            const res = await fetch('/api/issues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    project: projectId,
                }),
            });

            if (res.ok) {
                toast.success('Issue created successfully!');
                reset();
                setOpen(false);
                onIssueCreated?.();
            } else {
                toast.error('Failed to create issue');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger || (
                    <Button className="bg-white text-black hover:bg-white/90">
                        <Plus className="mr-2 h-4 w-4" />
                        New Issue
                    </Button>
                )}
            </DrawerTrigger>

            <DrawerContent className="bg-zinc-950 border-t border-zinc-800">
                <div className="mx-auto w-full max-w-md">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl">Create New Issue</DrawerTitle>
                        <DrawerDescription>
                            Add a new task to this project
                        </DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-8 space-y-6">
                        <div>
                            <Label htmlFor="title">Issue Title</Label>
                            <Input
                                id="title"
                                placeholder="Fix login button styling"
                                {...register('title')}
                                className="bg-zinc-900 border-zinc-800"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Add detailed description..."
                                {...register('description')}
                                className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Priority</Label>
                                <Select onValueChange={(value) => setValue('priority', value as any)} value={priorityValue}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select onValueChange={(value) => setValue('status', value as any)} value={statusValue}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BACKLOG">Backlog</SelectItem>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                            {loading ? 'Creating Issue...' : 'Create Issue'}
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}