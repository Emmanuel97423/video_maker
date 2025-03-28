import { createClient } from '@/utils/supabase/client';

export interface UserData {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
}

export async function getCurrentUser(): Promise<UserData | null> {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', authError);
            return null;
        }

        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('id, email, full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (dbError) {
            console.error('Erreur lors de la récupération des données utilisateur:', dbError);
            return null;
        }

        return userData;
    } catch (error) {
        console.error('Erreur inattendue lors de la récupération des données utilisateur:', error);
        return null;
    }
} 