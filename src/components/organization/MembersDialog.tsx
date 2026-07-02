'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, UserPlus, Trash2, Crown, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface Member {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface MembersDialogProps {
    orgId: string;
    members: Member[];
    ownerId?: string;
    currentUserId?: string;
    onMembersChanged: () => void;
    trigger?: React.ReactNode;
}

export default function MembersDialog({
    orgId,
    members,
    ownerId,
    currentUserId,
    onMembersChanged,
    trigger,
}: MembersDialogProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [localMembers, setLocalMembers] = useState<Member[]>(members);

    // Sync whenever parent members prop changes
    useEffect(() => {
        setLocalMembers(members);
    }, [members]);

    const handleInvite = async () => {
        if (!email.trim()) return;
        setInviting(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/organizations/${orgId}/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || data.error || 'Failed to invite member');
                return;
            }

            toast.success(`${email} has been added to the organization!`);
            setEmail('');
            setLocalMembers(data.members || []);
            onMembersChanged();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (memberId: string, memberName: string) => {
        if (!confirm(`Remove ${memberName} from this organization?`)) return;
        setRemovingId(memberId);
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                toast.error('Failed to remove member');
                return;
            }

            const data = await res.json();
            toast.success(`${memberName} has been removed`);
            setLocalMembers(data.members || []);
            onMembersChanged();
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setRemovingId(null);
        }
    };

    const getInitials = (name?: string, email?: string) => {
        const text = name?.trim() || email?.trim();

        if (!text) return '?';

        return text
            .split(' ')
            .filter(Boolean)
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                        <Users className="mr-2 h-4 w-4" />
                        Members
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="w-[95vw] sm:max-w-[520px] bg-zinc-950 border-zinc-800 max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Members</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Manage who has access to this organization
                    </DialogDescription>
                </DialogHeader>

                {/* Invite by email */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-300">Invite by email</p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleInvite()}
                            className="bg-zinc-900 border-zinc-800 flex-1"
                        />
                        <Button
                            onClick={handleInvite}
                            disabled={inviting || !email.trim()}
                            className="bg-white text-black hover:bg-white/90"
                        >
                            {inviting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <><UserPlus className="mr-2 h-4 w-4" /> Invite</>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-zinc-600">
                        The user must already have a SprintTrekker account.
                    </p>
                </div>

                <div className="border-t border-zinc-800 my-1" />

                {/* Members list */}
                <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                    <p className="text-sm font-medium text-zinc-300 mb-3">
                        {localMembers.length} member{localMembers.length !== 1 ? 's' : ''}
                    </p>
                    {localMembers.map(member => {
                        const isOwner = member._id === ownerId;
                        const isCurrentUser = member._id === currentUserId;
                        const canRemove = !isOwner && !isCurrentUser;

                        return (
                            <div
                                key={member._id}
                                className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                                        {member.avatar ? (
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                        ) : (
                                            getInitials(member.name, member.email)
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white">{member.name}</p>
                                            {isOwner && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-400">
                                                    <Crown className="h-2.5 w-2.5 mr-1" />
                                                    Owner
                                                </Badge>
                                            )}
                                            {isCurrentUser && !isOwner && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-600 text-zinc-400">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500">{member.email}</p>
                                    </div>
                                </div>

                                {canRemove && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                                        disabled={removingId === member._id}
                                        onClick={() => handleRemove(member._id, member.name)}
                                    >
                                        {removingId === member._id ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
