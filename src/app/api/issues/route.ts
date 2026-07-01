import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/issues`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${req.headers.get('authorization')?.split('Bearer ')[1]}`,
        },
        body: JSON.stringify(body),
    });
    return NextResponse.json(await res.json());
}