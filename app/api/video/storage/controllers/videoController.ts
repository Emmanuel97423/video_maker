import { createClientForServer } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Types
type VideoMetadata = {
    taskId: string;
    userId: string;
    imageUrl?: string;
    videoUrl: string;
};

type VideoFile = {
    name: string;
    owner_id: string;
    path: string;
    size: number;
    type: string;
}

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const BUCKET_NAME = 'videos';

// Fonctions utilitaires
export const createSupabaseClient = (): SupabaseClient => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Variables d\'environnement Supabase manquantes');
    }

    return createClient(supabaseUrl, supabaseServiceKey);
};

// Fonctions de traitement
export const validateVideoSize = async (videoUrl: string): Promise<Blob> => {
    console.log('Téléchargement de la vidéo depuis:', videoUrl);
    const response = await fetch(videoUrl);
    if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement de la vidéo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Taille du fichier:', (blob.size / (1024 * 1024)).toFixed(2), 'MB');
    
    if (blob.size > MAX_FILE_SIZE) {
        throw new Error(`La taille du fichier (${(blob.size / (1024 * 1024)).toFixed(2)}MB) dépasse la limite autorisée (50MB)`);
    }
    
    return blob;
};

export const uploadVideoToStorage = async (
    supabase: SupabaseClient,
    userId: string,
    taskId: string,
    videoBlob: Blob
): Promise<string> => {
    try {
        if (!videoBlob) {
            throw new Error('Blob vidéo manquant');
        }

        if (!userId || !taskId) {
            throw new Error('UserId ou TaskId manquant');
        }

        const blobSize = (videoBlob.size / (1024 * 1024)).toFixed(2);
        console.log('Début de l\'upload...', {
            userId,
            taskId,
            blobSize: `${blobSize}MB`
        });

        // Créer un nom de fichier unique basé sur le taskId
        const filePath = `${userId}/${taskId}.mp4`;

        console.log('Tentative d\'upload vers:', filePath);

        const { error: uploadError, data } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(filePath, videoBlob, {
                contentType: 'video/mp4',
                upsert: true,
                cacheControl: '3600'
            });

        if (uploadError) {
            console.error('Erreur d\'upload:', uploadError);
            throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
        }

        // Générer l'URL publique
        const { data: { publicUrl } } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        console.log('Upload réussi, URL publique:', publicUrl);
        return publicUrl;

    } catch (error) {
        console.error('Erreur dans uploadVideoToStorage:', error);
        throw error;
    }
};

export const saveVideoMetadata = async (
    supabase: SupabaseClient,
    metadata: VideoMetadata
): Promise<any> => {
    try {
        console.log('Début de la sauvegarde des métadonnées...', metadata);

        // Vérifier si la vidéo existe déjà
        const { data: existingVideo } = await supabase
            .from('videos')
            .select('*')
            .eq('task_id', metadata.taskId)
            .maybeSingle();

        // Télécharger et valider la vidéo
        const videoBlob = await validateVideoSize(metadata.videoUrl);

        // Upload la vidéo et obtenir l'URL publique
        const videoUrl = await uploadVideoToStorage(
            supabase,
            metadata.userId,
            metadata.taskId,
            videoBlob
        );

        if (existingVideo) {
            // Mise à jour de l'enregistrement existant
            const { data, error } = await supabase
                .from('videos')
                .update({
                    status: 'completed',
                    video_url: videoUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('task_id', metadata.taskId)
                .select()
                .single();

            if (error) throw new Error(`Erreur mise à jour DB: ${error.message}`);
            return data;
        }

        // Création d'un nouvel enregistrement
        const { data, error } = await supabase
            .from('videos')
            .insert({
                task_id: metadata.taskId,
                user_id: metadata.userId,
                image_url: metadata.imageUrl || 'placeholder.jpg',
                status: 'completed',
                video_url: videoUrl,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw new Error(`Erreur insertion DB: ${error.message}`);
        console.log('Métadonnées sauvegardées avec succès:', data);
        return data;

    } catch (error) {
        console.error('Erreur dans saveVideoMetadata:', error);
        throw error;
    }
};
