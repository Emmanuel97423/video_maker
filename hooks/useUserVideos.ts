import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserVideos, Video } from '@/actions/video-actions';

interface UseUserVideosProps {
    limit?: number;
    offset?: number;
}

export function useUserVideos({ limit = 100, offset = 0 }: UseUserVideosProps) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videos = await getUserVideos({ limit, offset });
                setVideos(videos);
                setIsAuthenticated(true);
            } catch (err) {
                if (err instanceof Error && err.message === 'Utilisateur non authentifié') {
                    setIsAuthenticated(false);
                } else {
                    setError(err instanceof Error ? err.message : 'Une erreur est survenue');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [limit, offset]);

    return { videos, loading, error, isAuthenticated };
} 