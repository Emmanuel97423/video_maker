'use client';

import { useUserVideos } from '@/hooks/useUserVideos';
import { Button } from './ui/button';
import { Loader2, Play } from 'lucide-react';
import { useState } from 'react';

export function VideoList() {
    const { videos, loading, error } = useUserVideos();
    const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

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
        return null; // L'état vide sera géré par le composant parent
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
                <div
                    key={video.id}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm"
                    onMouseEnter={() => setHoveredVideoId(video.id)}
                    onMouseLeave={() => setHoveredVideoId(null)}
                >
                    <div className="aspect-video relative">
                        {video.status === 'completed' && video.video_url && hoveredVideoId === video.id ? (
                            <div className="w-full h-full relative">
                                <video
                                    src={video.video_url}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={video.image_url}
                                    alt={video.title || 'Video thumbnail'}
                                    className="object-cover w-full h-full"
                                />
                                {video.status === 'processing' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium mb-2">
                            {video.title || 'Vidéo sans titre'}
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm ${
                                video.status === 'completed' ? 'text-green-600' :
                                video.status === 'failed' ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                                {video.status === 'completed' ? 'Terminé' :
                                 video.status === 'failed' ? 'Échoué' :
                                 'En cours'}
                            </span>
                            {video.video_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                                        Voir la vidéo
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 