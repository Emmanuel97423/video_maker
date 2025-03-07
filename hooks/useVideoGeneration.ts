import { VIDEO_GENERATION_STATUS } from '@/lib/minimaxi/types';
import { VideoService } from '@/lib/minimaxi/video-service';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface VideoData {
  task_id: string; // taskId from minimaxi
  imageUrl: string;
  videoUrl: string;
  userId: string;
}

export const useVideoGeneration = () => {
  const [status, setStatus] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateThumbnailFromVideo = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;

      video.addEventListener('loadeddata', () => {
        video.currentTime = 1; // Capture à 1 seconde
      });

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir en base64
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      });

      video.addEventListener('error', (e) => {
        reject(new Error('Erreur lors de la génération du thumbnail'));
      });
    });
  };

  const saveVideoToDatabase = async (videoData: VideoData) => {
    try {
      // Générer le thumbnail à partir de la vidéo
      // const thumbnailBase64 = await generateThumbnailFromVideo(videoData.videoUrl);
      
      // Upload le thumbnail via l'API
      // const thumbnailResponse = await fetch('/api/thumbnail/upload', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     thumbnailBase64,
      //     taskId: videoData.task_id
      //   }),
      // });

      // if (!thumbnailResponse.ok) {
      //   throw new Error('Erreur l\'upload du thumbnail');
      // }

      // const { url: thumbnailUrl } = await thumbnailResponse.json();

      // Sauvegarder la vidéo avec l'URL du thumbnail
      const response = await fetch('/api/video/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: videoData.task_id,
          image_url: videoData.imageUrl,
          video_url: videoData.videoUrl,
          status: 'completed',
          title: 'Video generated by user'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde de la vidéo');
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
              task_id: taskId,
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