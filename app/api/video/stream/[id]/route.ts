import { createClientForServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClientForServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Récupérer les informations de la vidéo depuis la base de données
        const { data: video, error: videoError } = await supabase
            .from('videos')
            .select('*')
            .eq('id', params.id)
            .single();

        if (videoError || !video) {
            return NextResponse.json(
                { error: "Vidéo non trouvée" },
                { status: 404 }
            );
        }

        // Vérifier que l'utilisateur a le droit d'accéder à cette vidéo
        if (video.user_id !== user.id) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Créer une URL signée pour accéder à la vidéo
        const { data: signedUrl, error: signedUrlError } = await supabase
            .storage
            .from('videos')
            .createSignedUrl(`${user.id}/${video.name}`, 3600); // URL valide pendant 1 heure

        if (signedUrlError) {
            return NextResponse.json(
                { error: "Erreur lors de la création de l'URL de la vidéo" },
                { status: 500 }
            );
        }

        // Rediriger vers l'URL signée
        return NextResponse.redirect(signedUrl.signedUrl);

    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de la vidéo" },
            { status: 500 }
        );
    }
} 