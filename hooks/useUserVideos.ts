import { useEffect, useState } from 'react';

// Types
type Video = {
    id: string;
    name: string;
    owner_id: string;
};

type FetchOptions = {
    limit?: number;
    offset?: number;
};

export const useUserVideos = (options: FetchOptions = {}) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/video/list?limit=${options.limit || 100}&offset=${options.offset || 0}`);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const { success, files, error } = await response.json();

            if (!success || error) {
                throw new Error(error || 'Erreur lors de la récupération des vidéos');
            }

            setVideos(files);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des vidéos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [options.limit, options.offset]);

    return { 
        videos, 
        loading, 
        error, 
        refetch: fetchVideos 
    };
}; 