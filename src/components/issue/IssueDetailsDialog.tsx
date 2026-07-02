'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Calendar, User as UserIcon } from 'lucide-react';
import { auth } from '@/lib/firebase';

const issueSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE']),
    assignee: z.string().nullable().optional(),
    sprint: z.string().nullable().optional(),
});

type IssueForm = z.infer<typeof issueSchema>;

interface IssueDetailsDialogProps {
    issue: any;
    isOpen: boolean;
    onClose: () => void;
    onIssueUpdated: () => void;
    members: any[];
    sprints: any[];
}

export default function IssueDetailsDialog({
    issue,
    isOpen,
    onClose,
    onIssueUpdated,
    members = [],
    sprints = [],
}: IssueDetailsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<IssueForm>({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            title: issue?.title || '',
            description: issue?.description || '',
            priority: issue?.priority || 'MEDIUM',
            status: issue?.status || 'TODO',
            assignee: issue?.assignee?._id || issue?.assignee || null,
            sprint: issue?.sprint?._id || issue?.sprint || null,
        },
    });

    const statusValue = watch('status');
    const priorityValue = watch('priority');
    const assigneeValue = watch('assignee');
    const sprintValue = watch('sprint');

    // Sync form values on issue update or modal open
    useEffect(() => {
        if (issue && isOpen) {
            reset({
                title: issue.title || '',
                description: issue.description || '',
                priority: issue.priority || 'MEDIUM',
                status: issue.status || 'TODO',
                assignee: issue.assignee?._id || issue.assignee || null,
                sprint: issue.sprint?._id || issue.sprint || null,
            });
        }
    }, [issue, isOpen, reset]);

    const onSubmit = async (data: IssueForm) => {
        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/issues/${issue._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    assignee: data.assignee || null,
                    sprint: data.sprint || null,
                }),
            });

            if (res.ok) {
                toast.success('Issue updated successfully!');
                onIssueUpdated();
                onClose();
            } else {
                toast.error('Failed to update issue');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this issue?')) return;
        setDeleting(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/issues/${issue._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success('Issue deleted successfully');
                onIssueUpdated();
                onClose();
            } else {
                toast.error('Failed to delete issue');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-[600px] bg-zinc-950 border-zinc-800 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                        <DialogTitle className="text-2xl font-bold">Issue Details</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Edit information about this task
                        </DialogDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 rounded-lg"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                            id="edit-title"
                            placeholder="Fix login button styling"
                            {...register('title')}
                            className="bg-zinc-900 border-zinc-800 mt-1"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Add detailed description..."
                            {...register('description')}
                            className="bg-zinc-900 border-zinc-800 min-h-[120px] mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Priority</Label>
                            <Select
                                value={priorityValue}
                                onValueChange={(value) =>
                                    setValue('priority', value as any)
                                }
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1">
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
                            <Select
                                value={statusValue}
                                onValueChange={(value) =>
                                    setValue('status', value as any)
                                }
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1">
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

                        <div>
                            <Label className="flex items-center gap-1.5">
                                <UserIcon className="h-3.5 w-3.5 text-zinc-400" /> Assignee
                            </Label>
                            <Select
                                value={assigneeValue || 'unassigned'}
                                onValueChange={(value) =>
                                    setValue('assignee', value === 'unassigned' ? null : value)
                                }
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1">
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {members.map((member: any) => (
                                        <SelectItem key={member._id} value={member._id}>
                                            {member.name || member.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Sprint
                            </Label>
                            <Select
                                value={sprintValue || 'no-sprint'}
                                onValueChange={(value) =>
                                    setValue('sprint', value === 'no-sprint' ? null : value)
                                }
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 mt-1">
                                    <SelectValue placeholder="No Sprint" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no-sprint">No Sprint</SelectItem>
                                    {sprints.map((sprint: any) => (
                                        <SelectItem key={sprint._id} value={sprint._id}>
                                            {sprint.name} ({sprint.status})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="w-24 bg-zinc-90 w-28"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-white text-black hover:bg-white/90 w-28"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
