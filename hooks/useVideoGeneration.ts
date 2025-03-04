import { useState, useCallback } from 'react';
import { VideoService } from '@/lib/minimaxi/video-service';
import { VIDEO_GENERATION_STATUS } from '@/lib/minimaxi/types';
import { toast } from 'sonner';

export const useVideoGeneration = () => {
  const [status, setStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const saveVideoToDatabase = async (videoData: {
    id: string;
    imageUrl: string;
    videoUrl: string;
    userId: string;
  }) => {
    try {
      const response = await fetch('/api/video/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...videoData,
          status: 'completed',
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la vidéo');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const generateVideo = useCallback(async (imageUrl: string, prompt: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Démarrer la génération
      const taskId = await VideoService.invokeVideoGeneration(imageUrl, prompt);
      
      // Vérifier le statut toutes les 10 secondes
      const checkStatus = async () => {
        const { fileId, status } = await VideoService.queryVideoGeneration(taskId);
        setStatus(status);

        if (status === VIDEO_GENERATION_STATUS.SUCCESS && fileId) {
          const downloadUrl = await VideoService.fetchVideoResult(fileId);
          setDownloadUrl(downloadUrl);

          // Sauvegarder la vidéo dans Supabase
          try {
            await saveVideoToDatabase({
              id: taskId,
              imageUrl,
              videoUrl: downloadUrl,
              userId: 'user_id', // TODO: Récupérer l'ID de l'utilisateur connecté
            });
            toast.success('Vidéo générée et sauvegardée avec succès');
          } catch (error) {
            toast.error("La vidéo a été générée mais n'a pas pu être sauvegardée");
          }

          setIsLoading(false);
          return;
        }

        if (status === VIDEO_GENERATION_STATUS.FAIL) {
          setError('La génération de la vidéo a échoué');
          setIsLoading(false);
          return;
        }

        // Continuer à vérifier si en cours
        if ([VIDEO_GENERATION_STATUS.PREPARING, VIDEO_GENERATION_STATUS.QUEUEING, VIDEO_GENERATION_STATUS.PROCESSING].includes(status as any)) {
          setTimeout(checkStatus, 10000);
        }
      };

      await checkStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsLoading(false);
    }
  }, []);

  return {
    generateVideo,
    status,
    downloadUrl,
    error,
    isLoading,
  };
}; 