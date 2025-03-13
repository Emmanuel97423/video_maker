import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { 
    SaveVideoRequest, 
    SaveVideoResponse, 
    ErrorResponse,
    VideoData
} from '@/lib/types/video';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        
        // Récupérer l'utilisateur authentifié
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            const response: ErrorResponse = {
                success: false,
                error: "Non authentifié"
            };
            return NextResponse.json(response, { status: 401 });
        }

        const data: SaveVideoRequest = await request.json();

        // Vérification des données requises
        if (!data.task_id || !data.image_url || !data.status) {
            const response: ErrorResponse = {
                success: false,
                error: "Données manquantes"
            };
            return NextResponse.json(response, { status: 400 });
        }

        const videoData = {
            task_id: data.task_id,
            image_url: data.image_url,
            video_url: data.video_url,
            status: data.status,
            user_id: user.id,
            title: data.title,
            prompt: data.prompt,
            provider: data.provider,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: insertedData, error } = await supabase
            .from('videos')
            .insert([videoData])
            .select()
            .single();

        if (error) {
            console.error("Erreur Supabase:", error);
            const response: ErrorResponse = {
                success: false,
                error: "Erreur lors de la sauvegarde dans Supabase",
                details: error
            };
            return NextResponse.json(response, { status: 500 });
        }

        const response: SaveVideoResponse = {
            success: true,
            data: insertedData
        };
        return NextResponse.json(response);

    } catch (error) {
        console.error("Erreur:", error);
        const response: ErrorResponse = {
            success: false,
            error: "Erreur lors de la sauvegarde de la vidéo",
            details: error
        };
        return NextResponse.json(response, { status: 500 });
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