'use client';

import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { downloadVideo } from '@/utils/downloadVideo';
import { toast } from "sonner"
import { useUserVideos } from '@/hooks/useUserVideos';
import { Video } from '@/actions/video-actions';

type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface VideoListProps {
    limit?: number;
    offset?: number;
}

export function VideoList({ limit = 100, offset = 0 }: VideoListProps) {
    const [videoUrls, setVideoUrls] = useState<{[key: string]: string}>({});
    const [thumbnails, setThumbnails] = useState<{[key: string]: string}>({});
    const [loadingThumbnails, setLoadingThumbnails] = useState<{[key: string]: boolean}>({});
    const { videos, loading, error, isAuthenticated } = useUserVideos({ limit, offset });
    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

    async function getVideoUrls(videos: any[]) {
        const supabase = createClient();
        const {data: {user}} = await supabase.auth.getUser();
        
        return Promise.all(videos.map(async (video) => {
            setLoadingThumbnails(prev => ({ ...prev, [video.id]: true }));
            const { data, error } = await supabase.storage.from('videos').createSignedUrl(`upload_videos/${user?.id}/${video.name}`, 60 * 60);
            if (error) {
                console.error('Erreur lors de la création de la URL de la vidéo:', error);
                setLoadingThumbnails(prev => ({ ...prev, [video.id]: false }));
                return null;
            }
            try {
                await generateThumbnail(data?.signedUrl, video.id);
            } catch (error) {
                console.error('Erreur lors de la génération de la miniature:', error);
            }
            setLoadingThumbnails(prev => ({ ...prev, [video.id]: false }));
            return {url: data?.signedUrl, name: video.name};
        }));
    }

    // Charger les URLs et les miniatures dès que les vidéos sont disponibles
    useEffect(() => {
        if (videos.length > 0) {
            getVideoUrls(videos);
        }
    }, [videos]);

    const generateThumbnail = async (videoUrl: string, videoId: string) => {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        
        return new Promise<void>((resolve) => {
            video.addEventListener('loadeddata', () => {
                video.currentTime = 0;
            });

            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                const thumbnailUrl = canvas.toDataURL('image/jpeg');
                setThumbnails(prev => ({
                    ...prev,
                    [videoId]: thumbnailUrl
                }));
                resolve();
            });
        });
    };

    const handleVideoHover = (video: Video) => {
        setHoveredVideoId(video.id);
    };

    const handleDownload = async (video: Video) => {
        try {
            if (video.url) {
                await downloadVideo(video.url, video.name);
                toast.success("La vidéo a été téléchargée avec succès");
            } else {
                toast.error("URL de la vidéo non disponible");
            }
        } catch (error) {
            toast.error("Impossible de télécharger la vidéo");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-8 text-gray-500">
                Veuillez vous connecter pour voir vos vidéos
            </div>
        );
    }

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
                      
                    >
                        <div className="aspect-video relative"
                          onMouseEnter={() => handleVideoHover(video)}
                          onMouseLeave={() => setHoveredVideoId(null)}
                        >
                            {thumbnails[video.id] ? (
                                <>
                                    <img
                                        src={thumbnails[video.id]}
                                        alt={video.name || 'Vignette de la vidéo'}
                                        className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-300 ${
                                            hoveredVideoId === video.id && video.url && status === 'completed'
                                                ? 'opacity-0'
                                                : 'opacity-100'
                                        }`}
                                    />
                                    {video.url && status === 'completed' && (
                                        <video
                                            src={video.url}
                                            className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-300 ${
                                                hoveredVideoId === video.id ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full bg-gray-100" />
                            )}
                            {loadingThumbnails[video.id] && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                                </div>
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
                                        onClick={() => handleDownload(video)}
                                        disabled={loadingThumbnails[video.id]}
                                    >
                                        {loadingThumbnails[video.id] ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            'Télécharger'
                                        )}
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