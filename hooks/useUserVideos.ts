import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

type Video = {
    id: string;
    task_id: string;
    image_url: string;
    video_url: string | null;
    status: 'processing' | 'completed' | 'failed';
    title: string | null;
    created_at: string;
};

export const useUserVideos = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setVideos(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des vidéos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return { videos, loading, error, refetch: fetchVideos };
}; 