import { useState, useCallback } from 'react';
import { VideoService } from '@/lib/minimaxi/video-service';
import { VIDEO_GENERATION_STATUS } from '@/lib/minimaxi/types';

export const useVideoGeneration = () => {
  const [status, setStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

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