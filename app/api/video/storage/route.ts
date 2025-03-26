/**
 * Configuration du client Supabase et constantes
 */
import { NextRequest, NextResponse } from 'next/server';
import {
    createSupabaseClient,
    uploadVideoToStorage,
    validateVideoSize
} from './controllers/videoController';

/**
 * Gère le téléchargement et le stockage d'une vidéo dans Supabase Storage.
 * 
 * @route POST /api/video/storage
 * @param {Request} request - Requête HTTP contenant videoUrl, taskId et imageUrl optionnel
 * @returns {Promise<NextResponse>} Réponse contenant l'URL de la vidéo stockée et les métadonnées
 * @throws {Error} Si l'authentification échoue ou si le stockage rencontre une erreur
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        console.log('Données reçues:', body);

        if (!body.videoUrl || !body.taskId || !body.userId) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        const supabase = createSupabaseClient();
        const videoBlob = await validateVideoSize(body.videoUrl);
        const result = await uploadVideoToStorage(
            supabase,
            body.userId,
            body.taskId,
            videoBlob
        );

        return NextResponse.json(result);

    } catch (error) {
        console.error('Erreur dans la route POST /api/video/storage:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const taskId = request.nextUrl.searchParams.get('taskId');
        if (!taskId) {
            return NextResponse.json(
                { error: 'TaskId manquant' },
                { status: 400 }
            );
        }

        const supabase = createSupabaseClient();
        
        // Supprimer la vidéo du stockage
        const { error: storageError } = await supabase
            .storage
            .from('videos')
            .remove([`${taskId}/video.mp4`]);

        if (storageError) {
            throw new Error(`Erreur lors de la suppression du fichier: ${storageError.message}`);
        }

        // Supprimer les métadonnées
        const { error: dbError } = await supabase
            .from('videos')
            .delete()
            .eq('task_id', taskId);

        if (dbError) {
            throw new Error(`Erreur lors de la suppression des métadonnées: ${dbError.message}`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Erreur dans la route DELETE /api/video/storage:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur inconnue' },
            { status: 500 }
        );
    }
} 