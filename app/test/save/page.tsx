'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function TestSavePage() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!prompt) {
            toast.error('Veuillez entrer un prompt');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch('/api/test/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }
            
            setResult(data);
            toast.success('Simulation réussie');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur lors de la simulation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Test de Sauvegarde Vidéo</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Prompt</label>
                    <Textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Entrez un prompt pour simuler la génération de vidéo..."
                        className="w-full h-32"
                    />
                </div>
                
                <Button 
                    type="submit" 
                    disabled={loading || !prompt}
                    className="w-full"
                >
                    {loading ? 'Simulation en cours...' : 'Simuler la génération et sauvegarde'}
                </Button>
            </form>
            
            {result && (
                <div className="mt-8 p-4 border rounded-md">
                    <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                    
                    {result.video?.video_url && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Vidéo de test :</h3>
                            <video 
                                src={result.video.video_url} 
                                controls 
                                poster={result.video.image_url}
                                className="w-full max-h-96 rounded-md"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 