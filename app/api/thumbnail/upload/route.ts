import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClientForServer();
        
        // Récupérer l'utilisateur authentifié
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const { thumbnailBase64, taskId } = await request.json();

        if (!thumbnailBase64 || !taskId) {
            return NextResponse.json(
                { error: "Données manquantes" },
                { status: 400 }
            );
        }

        // Convertir le base64 en Blob
        const base64Data = thumbnailBase64.split(',')[1];
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
        
        // Upload vers Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('thumbnails')
            .upload(`${taskId}/thumbnail.jpg`, blob, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (error) {
            console.error("Erreur Storage:", error);
            return NextResponse.json(
                { error: "Erreur lors de l'upload du thumbnail" },
                { status: 500 }
            );
        }

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase
            .storage
            .from('thumbnails')
            .getPublicUrl(`${taskId}/thumbnail.jpg`);

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error("Erreur:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'upload du thumbnail" },
            { status: 500 }
        );
    }
} 