import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        const body = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Project API Error:', error);
        return NextResponse.json({
            error: 'Failed to create project',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}