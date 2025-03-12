'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function TestStoragePage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            toast.error('Veuillez sélectionner un fichier');
            return;
        }
        
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('taskId', `test-${Date.now()}`);
            
            const response = await fetch('/api/test/storage', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }
            
            setResult(data);
            toast.success('Fichier uploadé avec succès');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Test de Supabase Storage</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Sélectionner une vidéo</label>
                    <Input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>
                
                <Button 
                    type="submit" 
                    disabled={loading || !file}
                    className="w-full"
                >
                    {loading ? 'Chargement...' : 'Uploader la vidéo'}
                </Button>
            </form>
            
            {result && (
                <div className="mt-8 p-4 border rounded-md">
                    <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                    
                    {result.url && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Vidéo uploadée :</h3>
                            <video 
                                src={result.url} 
                                controls 
                                className="w-full max-h-96 rounded-md"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 