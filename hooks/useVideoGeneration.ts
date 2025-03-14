import { KlingVideoService } from '@/lib/kling/video-service';
import { 
    VideoGenerationStatus, 
    VIDEO_GENERATION_STATUS 
} from '@/lib/types/kling';
import { VideoData } from '@/lib/types/video';
import { createClient } from '@/utils/supabase/client';
import { useCallback, useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';



export function useVideoGeneration() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<VideoGenerationStatus | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const pollingRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const checkStatus = useCallback(async (taskId: string) => {
    try {
      const result = await KlingVideoService.queryVideoGeneration(taskId);
      setStatus(result.status);
      setMessage(result.message || '');

      if (result.status === VIDEO_GENERATION_STATUS.SUCCESS && result.fileId) {
        setProgress(100);
        setDownloadUrl(result.fileId);
        const { data: { user } } = await createClient().auth.getUser();
        
        // Sauvegarder uniquement dans le storage
        const response = await fetch('/api/video/storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user?.id, 
            videoUrl: result.fileId,
            taskId: taskId 
          })
        });

        if (!response.ok) {
          throw new Error('Échec de la sauvegarde de la vidéo');
        }
        
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = undefined;
        }
        setIsLoading(false);
      } else if (result.status === VIDEO_GENERATION_STATUS.FAILED) {
        setError(result.message || 'Échec de la génération');
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = undefined;
        }
        setIsLoading(false);
      } else if (result.status === VIDEO_GENERATION_STATUS.PROCESSING) {
        // Pendant le traitement, on augmente progressivement jusqu'à 90%
        setProgress((prev) => Math.min(90, prev + 10));
      } else if (result.status === VIDEO_GENERATION_STATUS.SUBMITTED) {
        // Pour l'état soumis, on reste à un pourcentage bas
        setProgress((prev) => Math.min(20, prev));
      }
    } catch (error) {
      console.error('Erreur polling:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = undefined;
      }
      setIsLoading(false);
    }
  }, []);

  const generateVideo = useCallback(async (imageUrl: string, prompt: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    setProgress(0);
    setStatus(VIDEO_GENERATION_STATUS.SUBMITTED);

    try {
      const taskId = await KlingVideoService.invokeVideoGeneration(imageUrl, prompt);
      setProgress(10);

      // Premier check immédiat
      await checkStatus(taskId);

      // Puis toutes les 10 secondes
      pollingRef.current = setInterval(() => checkStatus(taskId), 20000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setStatus(VIDEO_GENERATION_STATUS.FAILED);
      setIsLoading(false);
    }
  }, [checkStatus]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = undefined;
      }
    };
  }, []);

  return {
    generateVideo,
    status,
    error,
    message,
    isLoading,
    progress,
    taskId,
    setTaskId,
    downloadUrl
  };
} 