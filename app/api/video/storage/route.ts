/**
 * Configuration du client Supabase et constantes
 */
import { createClientForServer } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import {
    createSupabaseClient,
    uploadVideoToStorage
} from './controllers/videoController';

interface StorageRequest {
    videoUrl: string;
    userId: string;
    prompt: string;
    imageUrl: string;
}

/**
 * Gère le téléchargement et le stockage d'une vidéo dans Supabase Storage.
 * 
 * @route POST /api/video/storage
 * @param {Request} request - Requête HTTP contenant videoUrl, taskId et imageUrl optionnel
 * @returns {Promise<NextResponse>} Réponse contenant l'URL de la vidéo stockée et les métadonnées
 * @throws {Error} Si l'authentification échoue ou si le stockage rencontre une erreur
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { userId, videoUrl }: StorageRequest = await request.json();
        
        
        if (!userId) {
            console.log('🔍 [Debug] Utilisateur non authentifié:', {
            });
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Initialisation du client Supabase
        const supabase = createSupabaseClient();

        // Téléchargement de la vidéo
        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors du téléchargement de la vidéo: ${response.statusText}`);
        }
        const videoBlob = await response.blob();

        // Upload vers Supabase Storage
        await uploadVideoToStorage(supabase, userId, videoBlob);

        return NextResponse.json({ 
            success: true,
            message: 'Vidéo uploadée avec succès'
        });

    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload de la vidéo' },
            { status: 500 }
        );
    }
} 