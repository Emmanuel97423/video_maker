import { VIDEO_GENERATION_STATUS, VideoGenerationResult, KlingResponse, KlingTaskStatus } from '@/lib/types/kling';

export class KlingVideoService {
    private static async getToken(): Promise<string> {
        console.log('🔑 [Kling] Récupération du token...');
        const response = await fetch('/api/kling/auth');
        const data = await response.json();
        if (!data.token) {
            console.error('❌ [Kling] Échec de récupération du token');
            throw new Error('Impossible d\'obtenir le token');
        }
        console.log('✅ [Kling] Token récupéré avec succès');
        return data.token;
    }

    private static async makeRequest<T>(endpoint: string, body?: any): Promise<T> {
        console.log(`🌐 [Kling] Requête ${endpoint}`, body ? `\nBody: ${JSON.stringify(body)}` : '');
        
        const response = await fetch('/api/kling/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                endpoint,
                body
            })
        });

        const data = await response.json();
        console.log(`📥 [Kling] Réponse:`, data);

        if (!response.ok) {
            console.error('❌ [Kling] Erreur API:', data);
            throw new Error(`Kling API Error: ${data.error || 'Unknown error'}`);
        }

        return data as T;
    }

    private static async imageUrlToBase64(imageUrl: string): Promise<string> {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                // Enlever le préfixe "data:image/jpeg;base64,"
                resolve(base64String.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    static async invokeVideoGeneration(imageUrl: string, prompt: string) {
        console.log('🎬 [Kling] Démarrage génération vidéo', { imageUrl, prompt });

        try {
            // Convertir l'URL de l'image en base64
            const imageBase64 = await this.imageUrlToBase64(imageUrl);
            console.log('📸 [Kling] Image convertie en base64');

            const requestBody = {
                model_name: 'kling-v1-6',
                mode: 'std',
                duration: '5',
                image: imageBase64, // Utiliser l'image en base64 au lieu de l'URL
                prompt,
                cfg_scale: 0.5
            };

            console.log('📤 [Kling] Envoi requête génération:', {
                ...requestBody,
                image: 'base64_image_content...' // Log sans le contenu base64 complet
            });

            const response = await this.makeRequest<KlingResponse<{
                task_id: string;
            }>>('/v1/videos/image2video', requestBody);

            console.log('✅ [Kling] Tâche créée:', response);
            return response.data.task_id;
        } catch (error) {
            console.error('❌ [Kling] Erreur génération:', error);
            throw error;
        }
    }

    static async queryVideoGeneration(taskId: string): Promise<VideoGenerationResult> {
        console.log(`🔍 [Kling] Début vérification statut tâche: ${taskId}`);
        
        try {
            const data = await this.makeRequest<KlingResponse<{
                task_id: string;
                task_status: KlingTaskStatus;
                task_status_msg: string;
                task_result?: {
                    videos: Array<{
                        id: string;
                        url: string;
                        duration: string;
                    }>;
                };
            }>>(`/v1/videos/image2video/${taskId}`, null);

            const taskData = data.data;
            console.log('📊 [Kling] Analyse statut:', {
                status: taskData.task_status,
                hasVideos: !!taskData.task_result?.videos?.length,
                videosCount: taskData.task_result?.videos?.length || 0
            });

            if (taskData.task_status === 'succeed') {
                if (taskData.task_result?.videos?.length) {
                    return {
                        status: VIDEO_GENERATION_STATUS.SUCCESS,
                        fileId: taskData.task_result.videos[0].url,
                        message: 'Vidéo générée avec succès'
                    };
                } else {
                    return {
                        status: VIDEO_GENERATION_STATUS.FAILED,
                        message: 'Vidéo non trouvée dans la réponse'
                    };
                }
            }

            const statusMap: Record<KlingTaskStatus, VideoGenerationResult> = {
                'processing': {
                    status: VIDEO_GENERATION_STATUS.PROCESSING,
                    message: taskData.task_status_msg || 'Génération en cours...'
                },
                'submitted': {
                    status: VIDEO_GENERATION_STATUS.SUBMITTED,
                    message: taskData.task_status_msg || 'Tâche soumise...'
                },
                'failed': {
                    status: VIDEO_GENERATION_STATUS.FAILED,
                    message: taskData.task_status_msg || 'Échec de la génération'
                },
                'succeed': {
                    status: VIDEO_GENERATION_STATUS.SUCCESS,
                    message: 'Vidéo générée avec succès'
                }
            };

            return statusMap[taskData.task_status];
        } catch (error) {
            console.error('❌ [Kling] Erreur vérification:', error);
            throw error;
        }
    }

    static async fetchVideoResult(videoUrl: string) {
        return videoUrl;
    }
} 