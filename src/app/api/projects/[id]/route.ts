import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    // Call your NestJS backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        headers: { Authorization: `Bearer ${req.headers.get('authorization')?.split('Bearer ')[1]}` },
    });
    return NextResponse.json(await res.json());
}