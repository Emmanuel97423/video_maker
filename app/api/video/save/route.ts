import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

type VideoData = {
    task_id: string;
    user_id: string;
    image_url: string;
    video_url?: string;
    status: 'processing' | 'completed' | 'failed';
    title?: string;
    created_at?: string;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        
        // Récupérer l'utilisateur authentifié
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log('🔍 [Debug] Utilisateur authentifié:', {
            userId: user?.id,
            authError: authError?.message
        });
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const data: VideoData = await request.json();

        // Vérification des données requises
        if (!data.task_id || !data.image_url || !data.status) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        const videoData = {
            task_id: data.task_id,
            image_url: data.image_url,
            video_url: data.video_url,
            status: data.status,
            user_id: user.id, // Utiliser l'ID de l'utilisateur authentifié
            title: data.title
        };

        // Insertion avec logging
        console.log('Tentative insertion avec les données:', videoData);
        
        const { data: insertedData, error } = await supabase
            .from('videos')
            .insert([videoData])
            .select()
            .single();

        if (error) {
            console.error("Erreur Supabase détaillée:", error);
            return NextResponse.json(
                { error: "Erreur lors de la sauvegarde dans Supabase", details: error },
                { status: 500 }
            );
        }

        return NextResponse.json(insertedData);

    } catch (error) {
        console.error("Erreur détaillée:", error);
        return NextResponse.json(
            { error: "Erreur lors de la sauvegarde de la vidéo", details: error },
            { status: 500 }
        );
    }
}

// Route pour mettre à jour le statut d'une vidéo
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        const data = await request.json();
        const { id, status, video_url } = data;

        if (!id || !status) {
            return NextResponse.json(
                { error: "ID et status requis" },
                { status: 400 }
            );
        }

        const updateData: Partial<VideoData> = {
            status,
            ...(video_url && { video_url }), // Ajoute video_url seulement s'il est défini
        };

        const { data: updatedData, error } = await supabase
            .from('videos')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Erreur Supabase:", error);
            return NextResponse.json(
                { error: "Erreur lors de la mise à jour dans Supabase" },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedData);

    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la vidéo" },
            { status: 500 }
        );
    }
} 