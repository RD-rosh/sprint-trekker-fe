import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = req.headers.get('authorization');
        const projectId = params.id;

        const res = await fetch(`${API_BASE}/issues/project/${projectId}`, {
            headers: { Authorization: token || '' },
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }
}