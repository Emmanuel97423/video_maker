'use client';

import { useUserVideos } from '@/hooks/useUserVideos';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface VideoListProps {
    limit?: number;
    offset?: number;
}

export function VideoList({ limit = 100, offset = 0 }: VideoListProps) {
    const [videoUrls, setVideoUrls] = useState<{[key: string]: string}>({});
    const { videos, loading, error } = useUserVideos({ limit, offset });
    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

    async function getVideoUrls(videos: any[]) {
        const supabase = createClient();
        const {data: {user}} = await supabase.auth.getUser();
        
        return Promise.all(videos.map(async (video) => {
            const { data, error } = await supabase.storage.from('videos').createSignedUrl(`${user?.id}/${video.name}`, 60 * 60);
            if (error) {
                console.error('Erreur lors de la création de la URL de la vidéo:', error);
                return null;
            }
            return {url: data?.signedUrl, name: video.name};
        }));
    }

    const handleVideoHover = async (video: any) => {
        if (!videoUrls[video.id]) {
            const urls = await getVideoUrls([video]);
            if (urls[0]?.url) {
                setVideoUrls(prev => ({
                    ...prev,
                    [video.id]: urls[0]?.url || ''
                }));
            }
        }
        setHoveredVideoId(video.id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                Aucune vidéo disponible
            </div>
        );
    }

    const getVideoStatus = (video: any): VideoStatus => {
        // Logique pour déterminer le statut de la vidéo
        // À adapter selon vos besoins
        return 'completed';
    };

    const getStatusText = (status: VideoStatus): string => {
        switch (status) {
            case 'completed':
                return 'Terminé';
            case 'failed':
                return 'Échoué';
            case 'processing':
                return 'En cours';
            default:
                return 'En attente';
        }
    };

    const getStatusColor = (status: VideoStatus): string => {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'failed':
                return 'text-red-600';
            case 'processing':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => {
                const status = getVideoStatus(video);
                return (
                    <div
                        key={video.id}
                        className="border rounded-lg overflow-hidden bg-white shadow-sm"
                        onMouseEnter={() => handleVideoHover(video)}
                        onMouseLeave={() => setHoveredVideoId(null)}
                    >
                        <div className="aspect-video relative">
                            {hoveredVideoId === video.id && videoUrls[video.id] && status === 'completed' ? (
                                <video
                                    src={videoUrls[video.id]}
                                    className="object-cover w-full h-full"
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <img
                                    src={`/api/video/thumbnail/${video.id}`}
                                    alt={video.name || 'Vignette de la vidéo'}
                                    className="object-cover w-full h-full"
                                />
                            )}
                            {status === 'processing' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium mb-2">
                                {video.name || 'Vidéo sans titre'}
                            </h3>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${getStatusColor(status)}`}>
                                    {getStatusText(status)}
                                </span>
                                {status === 'completed' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <a 
                                            href={`/api/video/stream/${video.id}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            Voir la vidéo
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 