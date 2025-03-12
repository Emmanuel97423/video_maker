import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { prompt, model = 'test-model' } = await request.json();
        
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt manquant' }, { status: 400 });
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
        
        // Générer un ID de tâche unique
        const taskId = uuidv4();
        
        // Créer une entrée dans la table tasks
        const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .insert({
                id: taskId,
                user_id: user.id,
                prompt: prompt,
                model: model,
                status: 'completed',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (taskError) {
            console.error('Erreur création tâche:', taskError);
            return NextResponse.json({ error: taskError.message }, { status: 500 });
        }
        
        // URL d'image et de vidéo de test
        const imageUrl = 'https://picsum.photos/800/450'; // Image aléatoire de test
        const videoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'; // Vidéo de test
        
        // Créer une entrée dans la table videos
        const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .insert({
                task_id: taskId,
                user_id: user.id,
                image_url: imageUrl,
                video_url: videoUrl,
                status: 'completed',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (videoError) {
            console.error('Erreur création vidéo:', videoError);
            return NextResponse.json({ error: videoError.message }, { status: 500 });
        }
        
        return NextResponse.json({
            success: true,
            task: taskData,
            video: videoData,
            message: "Simulation de génération et sauvegarde réussie"
        });
    } catch (error) {
        console.error('Erreur test save:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors du test de sauvegarde' },
            { status: 500 }
        );
    }
} 