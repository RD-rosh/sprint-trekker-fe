import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin'; // We'll create this

// POST - Create Organization
export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decodedToken = await adminAuth.verifyIdToken(token);
        const { name, description } = await req.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, description }),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }
}

// GET - Get User's Organizations
export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations?userId=${decodedToken.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }
}