import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';

// Taille maximale de fichier autorisée (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en octets

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const taskId = formData.get('taskId') as string || `test-${Date.now()}`;
        
        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Récupérer l'utilisateur authentifié
        const authClient = await createClientForServer();
        const { data: { user }, error: authError } = await authClient.auth.getUser();
        
        if (authError || !user) {
            console.log('🔍 [Debug] Utilisateur non authentifié:', {
                authError: authError?.message
            });
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        // Créer un client Supabase avec la clé de service
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Variables d\'environnement Supabase manquantes');
        }
        
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Vérifier la taille du fichier
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ 
                error: `La taille du fichier (${(file.size / (1024 * 1024)).toFixed(2)}MB) dépasse la limite autorisée (50MB)` 
            }, { status: 400 });
        }
        
        // Upload vers Supabase Storage
        const { data, error: storageError } = await supabase
            .storage
            .from('videos')
            .upload(`${taskId}/video.mp4`, file, {
                contentType: 'video/mp4',
                upsert: true,
                cacheControl: '3600'
            });
            
        if (storageError) {
            console.error('Erreur Storage:', storageError);
            return NextResponse.json({ error: storageError.message }, { status: 500 });
        }
        
        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase
            .storage
            .from('videos')
            .getPublicUrl(`${taskId}/video.mp4`);
            
        // Créer l'entrée dans la base de données avec l'URL de la vidéo
        const { data: videoData, error: dbError } = await supabase
            .from('videos')
            .insert({
                task_id: taskId,
                status: 'completed',
                video_url: publicUrl,
                image_url: 'placeholder.jpg',
                user_id: user.id
            })
            .select()
            .single();
            
        if (dbError) {
            console.error('Erreur DB:', dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }
            
        return NextResponse.json({ 
            success: true, 
            url: publicUrl,
            taskId: taskId,
            userId: user.id
        });
    } catch (error) {
        console.error('Erreur Storage:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload de la vidéo' },
            { status: 500 }
        );
    }
} 