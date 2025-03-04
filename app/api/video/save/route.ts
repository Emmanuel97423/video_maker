import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

type VideoData = {
    id: string;
    imageUrl: string;
    videoUrl?: string;
    status: 'processing' | 'completed' | 'failed';
    userId: string;
    title?: string;
    created_at?: string;
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        const data: VideoData = await request.json();

        // Vérification des données requises
        if (!data.id || !data.imageUrl || !data.status || !data.userId) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        // La date de création est gérée automatiquement par Supabase
        // Pas besoin de l'ajouter manuellement
        const videoData = {
            ...data,
        };

        // Insertion dans la table 'videos'
        const { data: insertedData, error } = await supabase
            .from('videos')
            .insert([videoData])
            .select()
            .single();

        if (error) {
            console.error("Erreur Supabase:", error);
            return NextResponse.json(
                { error: "Erreur lors de la sauvegarde dans Supabase" },
                { status: 500 }
            );
        }

        return NextResponse.json(insertedData);

    } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        return NextResponse.json(
            { error: "Erreur lors de la sauvegarde de la vidéo" },
            { status: 500 }
        );
    }
}

// Route pour mettre à jour le statut d'une vidéo
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        const data = await request.json();
        const { id, status, videoUrl } = data;

        if (!id || !status) {
            return NextResponse.json(
                { error: "ID et status requis" },
                { status: 400 }
            );
        }

        const updateData: Partial<VideoData> = {
            status,
            ...(videoUrl && { videoUrl }), // Ajoute videoUrl seulement s'il est défini
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