import { createClient } from '@/utils/supabase/client';
import { PlanType, PLAN_LIMITS } from '@/supabase/types';
import { UserQuotaRow } from '@/supabase/supabase-helpers';

export async function getUserQuota(userId: string): Promise<UserQuotaRow | null> {
    try {
        const supabase = createClient();
        const { data: quota, error } = await supabase
            .from('user_quotas')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Erreur lors de la récupération du quota:', error);
            return null;
        }

        return quota;
    } catch (error) {
        console.error('Erreur inattendue coté serveur lors de la récupération du quota:', error);
        return null;
    }
}

export async function initializeUserQuota(userId: string): Promise<UserQuotaRow | null> {
    try {
        const supabase = createClient();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data: quota, error } = await supabase
            .from('user_quotas')
            .upsert({
                user_id: userId,
                plan: 'FREE' as PlanType,
                video_count: 0,
                max_videos: PLAN_LIMITS.FREE,
                reset_date: thirtyDaysFromNow.toISOString(),
            }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) {
            console.error("Erreur lors de l'initialisation du quota:", error);
            return null;
        }

        return quota;
    } catch (error) {
        console.error("Erreur inattendue lors de l'initialisation du quota:", error);
        return null;
    }
}

export async function incrementVideoCount(quotaId: string): Promise<UserQuotaRow | null> {
    try {
        const supabase = createClient();
        
        // Récupérer d'abord le user_id à partir du quotaId
        const { data: quota } = await supabase
            .from('user_quotas')
            .select('user_id')
            .eq('id', quotaId)
            .single();

        if (!quota) return null;

        // Appeler la fonction RPC avec le user_id
        const { error: rpcError } = await supabase
            .rpc('increment_video_count', {
                user_id_param: quota.user_id
            });

        if (rpcError) {
            console.error('Erreur lors de l\'incrémentation via RPC:', rpcError);
            return null;
        }

        // Récupérer le quota mis à jour
        const { data: updatedQuota, error } = await supabase
            .from('user_quotas')
            .select('*')
            .eq('id', quotaId)
            .single();

        if (error) {
            console.error('Erreur lors de la récupération du quota mis à jour:', error);
            return null;
        }

        return updatedQuota;
    } catch (error) {
        console.error('Erreur inattendue lors de la mise à jour du compteur:', error);
        return null;
    }
}

export async function resetQuota(quotaId: string): Promise<UserQuotaRow | null> {
    try {
        const supabase = createClient();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const { data: quota, error } = await supabase
            .from('user_quotas')
            .update({
                video_count: 0,
                reset_date: thirtyDaysFromNow.toISOString()
            })
            .eq('id', quotaId)
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de la réinitialisation du quota:', error);
            return null;
        }

        return quota;
    } catch (error) {
        console.error('Erreur inattendue lors de la réinitialisation du quota:', error);
        return null;
    }
}

export async function updateUserPlan(quotaId: string, plan: PlanType): Promise<UserQuotaRow | null> {
    try {
        const supabase = createClient();
        const { data: quota, error } = await supabase
            .from('user_quotas')
            .update({
                plan,
                max_videos: PLAN_LIMITS[plan]
            })
            .eq('id', quotaId)
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de la mise à jour du plan:', error);
            return null;
        }

        return quota;
    } catch (error) {
        console.error('Erreur inattendue lors de la mise à jour du plan:', error);
        return null;
    }
}
