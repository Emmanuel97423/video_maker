import { createClientForServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

import { listUserVideos } from './controllers/videoListController';

export async function GET(request: Request) {
    try {
        const supabase = await createClientForServer();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Récupération des paramètres de pagination depuis l'URL
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Récupération des vidéos
        const { files, error } = await listUserVideos(supabase, user?.id, { limit, offset });

        if (error) {
            throw error;    
        }

        return NextResponse.json({ 
            success: true,
            files
        });

    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de la récupération des vidéos' },
            { status: 500 }
        );
    }
}