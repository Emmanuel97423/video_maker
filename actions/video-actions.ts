import { createClient } from '@/utils/supabase/client';

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Video {
    id: string;
    name: string;
    status: VideoStatus;
    created_at: string;
    user_id: string;
    url?: string;
}

export async function getUserVideos({ limit = 100, offset = 0 }: { limit?: number; offset?: number }) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Utilisateur non authentifié');
        }

        const { data: videos, error } = await supabase.storage.from('videos').list(`upload_videos/${user.id}`, {
            limit: limit,
            offset: offset,
            sortBy: { column: 'created_at', order: 'desc' }
        });

        if (error) {
            throw error;
        }

        const videosWithUrls = await Promise.all(videos.map(async file => {
            const { data } = await supabase.storage
                .from('videos')
                .createSignedUrl(`upload_videos/${user.id}/${file.name}`, 3600);
            
            return {
                id: file.id,
                name: file.name,
                status: 'completed' as VideoStatus,
                created_at: file.created_at,
                user_id: user.id,
                url: data?.signedUrl
            };
        }));

        return videosWithUrls;
    } catch (error) {
        console.error('Erreur lors de la récupération des vidéos:', error);
        throw error;
    }
}

export async function getVideoSignedUrl(videoName: string, userId: string) {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.storage
            .from('videos')
            .createSignedUrl(`upload_videos/${userId}/${videoName}`, 60 * 60);

        if (error) {
            throw error;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Erreur lors de la création de l\'URL signée:', error);
        throw error;
    }
}

export async function updateVideoStatus(videoId: string, status: VideoStatus) {
    try {
        const supabase = createClient();
        const { error } = await supabase
            .from('videos')
            .update({ status })
            .eq('id', videoId);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la vidéo:', error);
        throw error;
    }
}
