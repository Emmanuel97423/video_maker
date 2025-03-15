import { createClient } from '@/utils/supabase/client';

export class StorageService {
    private static readonly BUCKET_NAME = 'videos';
    private static readonly FOLDER_NAME = 'generated';

    static async saveVideoToStorage(videoUrl: string, taskId: string, imageUrl?: string): Promise<string> {
        try {
            console.log('Début de la sauvegarde de la vidéo via l\'API');
            
            const { data: { user } } = await createClient().auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const response = await fetch('/api/video/storage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    taskId: taskId,
                    videoUrl: videoUrl,
                    imageUrl: imageUrl
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Échec de la sauvegarde: ${error}`);
            }

            const data = await response.json();
            console.log('Vidéo sauvegardée avec succès:', data);
            return data.video_url;



        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la vidéo:', error);
            throw error;
        }
    }

    static async deleteVideo(taskId: string): Promise<void> {
        try {
            const response = await fetch(`/api/video/storage?taskId=${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Échec de la suppression: ${error}`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la vidéo:', error);
            throw error;
        }
    }
} 