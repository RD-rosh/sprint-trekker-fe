// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//     const { id } = params;
//     // Call your NestJS backend
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
//         headers: { Authorization: `Bearer ${req.headers.get('authorization')?.split('Bearer ')[1]}` },
//     });
//     return NextResponse.json(await res.json());
// }

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        const body = await req.json();

        const res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || '',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}