import { KlingAuthService } from '@/lib/kling/auth-service';
import { NextResponse } from 'next/server';

const KLING_API_URL = process.env.NEXT_PUBLIC_KLING_API_URL;

export async function POST(request: Request) {
    try {
        const token = KlingAuthService.generateToken();
        const { endpoint, body } = await request.json();

        console.log('Endpoint:', endpoint);
        console.log('Request Body:', body);

        // Si c'est une requête de statut (contient un ID)
        if (endpoint.includes('/v1/videos/image2video/')) {
            const response = await fetch(`${KLING_API_URL}${endpoint}`, {
                method: 'GET', // Utiliser GET pour les requêtes de statut
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Status Response:', data);
            return NextResponse.json(data);
        }

        // Pour les autres requêtes (création de tâche)
        const response = await fetch(`${KLING_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok || data.ResponseMeta?.ErrorCode) {
            console.error('Kling API Error:', data);
            return NextResponse.json(data, { status: response.status || 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur API Kling:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'appel à l\'API Kling' },
            { status: 500 }
        );
    }
} 