'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { auth } from '@/lib/firebase';

const sprintSchema = z.object({
    name: z.string().min(3, 'Sprint name must be at least 3 characters'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
});

type SprintForm = z.infer<typeof sprintSchema>;

interface CreateSprintDialogProps {
    projectId: string;
    onSprintCreated?: () => void;
}

export default function CreateSprintDialog({ projectId, onSprintCreated }: CreateSprintDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SprintForm>({
        resolver: zodResolver(sprintSchema),
        defaultValues: {
            name: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days default
        },
    });

    const onSubmit = async (data: SprintForm) => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();

            const res = await fetch('/api/sprints', {
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
                toast.success('Sprint created successfully!');
                reset();
                setOpen(false);
                onSprintCreated?.();
            } else {
                toast.error('Failed to create sprint');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                    <Plus className="mr-2 h-4 w-4" />
                    New Sprint
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] sm:max-w-[450px] bg-zinc-950 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">New Sprint</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Create a new sprint iteration for this project
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="sprint-name">Sprint Name</Label>
                        <Input
                            id="sprint-name"
                            placeholder="Sprint 1 - Initial MVP"
                            {...register('name')}
                            className="bg-zinc-900 border-zinc-800 mt-1"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input
                                id="start-date"
                                type="date"
                                {...register('startDate')}
                                className="bg-zinc-900 border-zinc-800 mt-1"
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="end-date">End Date</Label>
                            <Input
                                id="end-date"
                                type="date"
                                {...register('endDate')}
                                className="bg-zinc-900 border-zinc-800 mt-1"
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            className="w-24 bg-zinc-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-white text-black hover:bg-white/90 w-28"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
