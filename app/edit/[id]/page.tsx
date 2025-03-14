'use client';

import { useState, useEffect, useRef, use } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from '@/utils/supabase/client';
import { 
    IconBolt, 
    IconRefresh, 
    IconPlayerPlay,
    IconPlayerPause,
    IconRotate,
    IconPlayerTrackNext,
    IconVolume, 
    IconMaximize 
} from "@tabler/icons-react";

export default function VideoEditPage({ params }: { params: { id: string } }) {
    const [currentTime, setCurrentTime] = useState('00:00:00');
    const [duration, setDuration] = useState('00:05:10');
    const [watermarkRemoved, setWatermarkRemoved] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const supabase = createClient();

    useEffect(() => {
        loadVideo();
    }, []);

    async function loadVideo() {
        const data = await getVideoStream();
        if (data?.signedUrl) {
            setVideoUrl(data.signedUrl);
        }
    }

    async function getVideoStream() {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase.storage
            .from('videos')
            .createSignedUrl(`${user?.id}/${params.id}`, 60 * 60);

        if (error) {
            console.error('Erreur lors de la récupération du flux vidéo:', error);
            return;
        }

        return data;
    }

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(formatTime(videoRef.current.currentTime));
        }
    };

    return (
        <div className="max-w-[480px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {/* En-tête */}
            <div className="flex items-center justify-between p-3 border-b">
                <button className="flex items-center gap-2 text-orange-500 text-sm font-medium px-3 py-1.5 rounded-lg bg-orange-50">
                    <IconBolt size={16} /> Remove watermark
                </button>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-full hover:bg-gray-100">
                        <IconRefresh size={18} />
                    </button>
                    <select className="text-sm border rounded-lg px-3 py-1.5">
                        <option>Original</option>
                    </select>
                </div>
            </div>

            {/* Conteneur vidéo avec ratio 9:16 pour format portrait */}
            <div className="relative aspect-[9/16] bg-black">
                {videoUrl && (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-contain"
                        src={videoUrl}
                        poster="/placeholder-video.jpg"
                        onTimeUpdate={handleTimeUpdate}
                    />
                )}
                <div className="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    Low res preview
                </div>
            </div>

            {/* Contrôles vidéo */}
            <div className="flex items-center gap-3 p-3 border-t">
                <button onClick={togglePlay} className="p-1">
                    {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
                </button>
                <div className="text-xs text-gray-600 font-medium min-w-[100px]">
                    {currentTime} / {duration}
                </div>
                <div className="flex-1" />
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <IconRotate size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <IconPlayerTrackNext size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <IconVolume size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-full">
                    <IconMaximize size={18} />
                </button>
            </div>
        </div>
    );
}