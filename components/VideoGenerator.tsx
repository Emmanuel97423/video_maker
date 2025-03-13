import React, { useCallback } from 'react';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

const VideoGenerator: React.FC<{
    onGenerate: () => void;
    disabled?: boolean;
}> = ({ onGenerate, disabled }) => {
    const { isLoading, progress } = useVideoGeneration();

    return (
        <Button 
            onClick={onGenerate} 
            disabled={disabled || isLoading}
            className="w-full"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours... {progress.toFixed(0)}%
                </>
            ) : (
                'Générer une vidéo'
            )}
        </Button>
    );
};

export default VideoGenerator; 