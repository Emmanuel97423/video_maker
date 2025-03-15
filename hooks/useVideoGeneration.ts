import { useState, useCallback } from 'react';
import { UnifiedVideoService } from '@/lib/video-service';
import { VideoGenerationStatus, UNIFIED_STATUS, UnifiedStatus } from '@/lib/types/video-service';
import { StorageService } from '@/lib/storage-service';
import { toast } from 'sonner';

const MAX_POLLING_ATTEMPTS = 60; // 5 minutes (avec 5 secondes d'intervalle)
const POLLING_INTERVAL = 5000; // 5 secondes

export function useVideoGeneration() {
    const [status, setStatus] = useState<UnifiedStatus>(UNIFIED_STATUS.IDLE);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

    const updateProgress = useCallback((currentStatus: UnifiedStatus, attempt: number) => {
        switch (currentStatus) {
            case UNIFIED_STATUS.SUBMITTED:
            case UNIFIED_STATUS.PENDING:
                setProgress(Math.min(25 + Math.floor(attempt / MAX_POLLING_ATTEMPTS * 25), 50));
                break;
            case UNIFIED_STATUS.PROCESSING:
                setProgress(Math.min(50 + Math.floor(attempt / MAX_POLLING_ATTEMPTS * 25), 75));
                break;
            case UNIFIED_STATUS.SUCCESS:
                setProgress(75);
                break;
            case UNIFIED_STATUS.COMPLETED:
                setProgress(100);
                break;
            default:
                setProgress(0);
        }
    }, []);

    const mapStatusMessage = useCallback((status: UnifiedStatus): string => {
        switch (status) {
            case UNIFIED_STATUS.SUBMITTED:
            case UNIFIED_STATUS.PENDING:
                return 'Initialisation de la génération...';
            case UNIFIED_STATUS.PROCESSING:
                return 'Création de votre vidéo en cours...';
            case UNIFIED_STATUS.SUCCESS:
            case UNIFIED_STATUS.COMPLETED:
                return 'Finalisation de votre vidéo...';
            case UNIFIED_STATUS.FAILED:
                return 'Échec de la génération';
            default:
                return '';
        }
    }, []);

    const generateVideo = useCallback(async (imageUrl: string, prompt: string) => {
        try {
            setIsLoading(true);
            setError(null);
            setDownloadUrl(null);
            setCurrentTaskId(null);
            setStatus(UNIFIED_STATUS.SUBMITTED);
            updateProgress(UNIFIED_STATUS.SUBMITTED, 0);
            setMessage(mapStatusMessage(UNIFIED_STATUS.SUBMITTED));

            const taskId = await UnifiedVideoService.generateVideo(imageUrl, prompt);
            console.log('Task ID reçu:', taskId);
            setCurrentTaskId(taskId);

            // Polling du statut avec timeout
            let currentStatus: VideoGenerationStatus;
            let attempt = 0;

            do {
                if (attempt >= MAX_POLLING_ATTEMPTS) {
                    throw new Error('Délai d\'attente dépassé pour la génération de la vidéo');
                }

                await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
                currentStatus = await UnifiedVideoService.checkVideoStatus(taskId);
                console.log('Status actuel:', currentStatus);
                
                const mappedStatus = currentStatus.status as UnifiedStatus;
                setStatus(mappedStatus);
                updateProgress(mappedStatus, attempt);
                setMessage(mapStatusMessage(mappedStatus));

                attempt++;
            } while (
                currentStatus.status === UNIFIED_STATUS.PROCESSING || 
                currentStatus.status === UNIFIED_STATUS.PENDING ||
                currentStatus.status === UNIFIED_STATUS.SUBMITTED
            );

            if (
                (currentStatus.status === UNIFIED_STATUS.COMPLETED || 
                currentStatus.status === UNIFIED_STATUS.SUCCESS) && 
                currentStatus.fileId
            ) {
                const videoUrl = await UnifiedVideoService.getVideoUrl(currentStatus.fileId);
                
                // Sauvegarder dans Supabase via l'API
                setMessage('Sauvegarde de la vidéo...');
                const storedVideoUrl = await StorageService.saveVideoToStorage(videoUrl, taskId, imageUrl);
                
                setDownloadUrl(storedVideoUrl);
                setMessage('Vidéo générée et sauvegardée avec succès !');
                setStatus(UNIFIED_STATUS.COMPLETED);
                updateProgress(UNIFIED_STATUS.COMPLETED, MAX_POLLING_ATTEMPTS);
                toast.success('Vidéo sauvegardée avec succès !');
            } else {
                throw new Error(currentStatus.error || 'Échec de la génération');
            }
        } catch (error) {
            console.error('Erreur de génération:', error);
            setError(error instanceof Error ? error.message : 'Une erreur est survenue');
            setStatus(UNIFIED_STATUS.FAILED);
            setMessage(mapStatusMessage(UNIFIED_STATUS.FAILED));
            toast.error('Erreur lors de la génération de la vidéo');
            
            // En cas d'erreur, on essaie de nettoyer
            if (currentTaskId) {
                try {
                    await StorageService.deleteVideo(currentTaskId);
                } catch (cleanupError) {
                    console.error('Erreur lors du nettoyage:', cleanupError);
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [updateProgress, mapStatusMessage]);

    return {
        generateVideo,
        status,
        error,
        isLoading,
        progress,
        message,
        downloadUrl,
        currentTaskId
    };o
} 