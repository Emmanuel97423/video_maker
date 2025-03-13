import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ACCESS_KEY = process.env.NEXT_PUBLIC_KLING_ACCESS_KEY;
const SECRET_KEY = process.env.NEXT_PUBLIC_KLING_SECRET_KEY;

export async function GET() {
    try {
        const token = jwt.sign(
            {
                iss: ACCESS_KEY,
                exp: Math.floor(Date.now() / 1000) + 1800,
                nbf: Math.floor(Date.now() / 1000) - 5
            },
            SECRET_KEY!,
            {
                algorithm: 'HS256',
                header: { alg: 'HS256', typ: 'JWT' }
            }
        );

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Erreur génération token:', error);
        return NextResponse.json({ error: 'Erreur génération token' }, { status: 500 });
    }
} 