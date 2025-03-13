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
    const response = await fetch(videoUrl);
    if (!response.ok) {
        throw new Error(`Erreur lors du téléchargement de la vidéo: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    if (blob.size > MAX_FILE_SIZE) {
        throw new Error(`La taille du fichier (${(blob.size / (1024 * 1024)).toFixed(2)}MB) dépasse la limite autorisée (50MB)`);
    }
    
    return blob;
};

export const uploadVideoToStorage = async (
    supabase: SupabaseClient,
    userId: string,
    videoFile: File | Blob
): Promise<void> => {

    const fileName = `${Math.random()}.mp4`;
    const filePath = `${userId}/${fileName}`;
    const { error } = await supabase
        .storage
        .from('videos')
        .upload(filePath, videoFile, {
            contentType: 'video/mp4',
            upsert: true,
            cacheControl: '3600'
        });

    if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
    }
};

export const saveVideoMetadata = async (
    supabase: SupabaseClient,
    metadata: VideoMetadata
): Promise<any> => {
    const { data: existingVideo } = await supabase
        .from('videos')
        .select('*')
        .eq('task_id', metadata.taskId)
        .maybeSingle();

    const authenticatedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/videos/${metadata.taskId}/video.mp4`;

    if (existingVideo) {
        const { data, error } = await supabase
            .from('videos')
            .update({
                status: 'completed',
                video_url: authenticatedUrl,
                updated_at: new Date().toISOString()
            })
            .eq('task_id', metadata.taskId)
            .select()
            .single();

        if (error) throw new Error(`Erreur mise à jour DB: ${error.message}`);
        return data;
    }

    const { data, error } = await supabase
        .from('videos')
        .insert({
            task_id: metadata.taskId,
            user_id: metadata.userId,
            image_url: metadata.imageUrl || 'placeholder.jpg',
            status: 'completed',
            video_url: authenticatedUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) throw new Error(`Erreur insertion DB: ${error.message}`);
    return data;
};
