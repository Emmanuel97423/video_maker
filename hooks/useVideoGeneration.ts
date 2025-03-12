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
  const [status, setStatus] = useState<VideoGenerationStatus>(VIDEO_GENERATION_STATUS.SUBMITTED);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const provider = 'kling';


  // Fonction pour vérifier le statut
  const checkStatus = useCallback(async (taskId: string) => {
    try {
      const result = await KlingVideoService.queryVideoGeneration(taskId);
      
      setStatus(result.status);
      setMessage(result.message || '');

      switch (result.status) {
        case VIDEO_GENERATION_STATUS.SUCCESS:
          if (result.fileId) {
            setProgress(100);
            await save({
              videoUrl: result.fileId,
              taskId,
              prompt: '',
              imageUrl: ''
            });
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
            }
          }
          break;

        case VIDEO_GENERATION_STATUS.PROCESSING:
        case VIDEO_GENERATION_STATUS.SUBMITTED:
          setProgress((prev) => Math.min(90, prev + 5));
          break;

        case VIDEO_GENERATION_STATUS.FAILED:
          setError(result.message || 'Échec de la génération');
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
          }
          break;
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      throw error;
    }
  }, []);

  /**
   * Génère une vidéo à partir d'une image et d'un prompt
   * @param imageUrl - L'URL de l'image source
   * @param prompt - Le texte descriptif pour guider la génération
   * @throws {Error} Si la génération échoue
   */
  const generateVideo = useCallback(async (imageUrl: string, prompt: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    setProgress(0);
    setStatus(VIDEO_GENERATION_STATUS.SUBMITTED);

    try {
      const taskId = await KlingVideoService.invokeVideoGeneration(imageUrl, prompt);
      setProgress(10);

      // Démarrer le polling
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      // Premier check immédiat
      await checkStatus(taskId);

      // Puis toutes les 5 secondes
      pollingRef.current = setInterval(async () => {
        try {
          const result = await checkStatus(taskId);
          if (result.status === VIDEO_GENERATION_STATUS.SUCCESS || 
              result.status === VIDEO_GENERATION_STATUS.FAILED) {
            clearInterval(pollingRef.current);
          }
        } catch (error) {
          clearInterval(pollingRef.current);
          setError('Erreur lors de la vérification du statut');
        }
      }, 5000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      setStatus(VIDEO_GENERATION_STATUS.FAILED);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkStatus]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /**
   * Sauvegarde une vidéo générée dans le stockage
   * @param params - Les paramètres de sauvegarde
   * @param params.videoUrl - L'URL de la vidéo à sauvegarder
   * @param params.taskId - L'identifiant unique de la tâche
   * @param params.prompt - Le prompt utilisé pour la génération
   * @param params.imageUrl - L'URL de l'image source (optionnel)
   * @throws {Error} Si la sauvegarde échoue
   */
  const save = useCallback(async ({  videoUrl }: {
    userId: string;
    videoUrl: string;
  }) => {
    try {
      const { data: { user } } = await createClient().auth.getUser();
      const response = await fetch('/api/video/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, videoUrl })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      const data = await response.json();
      setDownloadUrl(data.url);
      toast.success('Vidéo sauvegardée avec succès');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      toast.error(message);
      throw error;
    }
  }, []);

  return {
    generateVideo,
    save,
    status,
    error,
    message,
    isLoading,
    downloadUrl,
    progress,
    provider
  };
} 