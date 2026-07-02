import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** DELETE /api/organizations/[id]/members/[userId] — remove member */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; userId: string }> }
) {
    try {
        const { id, userId } = await params;
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        await adminAuth.verifyIdToken(token);

        const res = await fetch(`${API_BASE}/organizations/${id}/members/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return NextResponse.json({ error: 'Failed to remove member' }, { status: res.status });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('Member DELETE error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
