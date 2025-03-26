import { useState, useEffect } from 'react';
import { UserQuotaRow } from '@/supabase/supabase-helpers';
import { getUserQuota, initializeUserQuota, incrementVideoCount, resetQuota } from '@/actions/quota-actions';
import { toast } from 'sonner';

export function useUserQuota(userId: string) {
    const [quota, setQuota] = useState<UserQuotaRow | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchQuota = async () => {
        if (!userId) {
            setQuota(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let userQuota = await getUserQuota(userId);

            // Si pas de quota, on initialise avec le plan FREE
            if (!userQuota) {
                userQuota = await initializeUserQuota(userId);
                if (!userQuota) {
                    throw new Error("Impossible d'initialiser le quota utilisateur");
                }
            } else {
                // Vérifier si le reset_date est dépassé
                const resetDate = new Date(userQuota.reset_date);
                if (resetDate < new Date()) {
                    userQuota = await resetQuota(userQuota.id);
                    if (!userQuota) {
                        throw new Error("Erreur lors de la réinitialisation du quota");
                    }
                }
            }

            setQuota(userQuota);
        } catch (error) {
            console.error('Erreur lors de la récupération du quota:', error);
            toast.error("Erreur lors de la récupération du quota");
            setQuota(null);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrementVideoCount = async () => {
        if (!quota) return false;

        if (quota.video_count >= quota.max_videos) {
            toast.error(`Limite de vidéos atteinte pour votre plan ${quota.plan}`);
            return false;
        }

        const updatedQuota = await incrementVideoCount(quota.id);
        if (!updatedQuota) {
            toast.error("Erreur lors de la mise à jour du quota");
            return false;
        }

        setQuota(updatedQuota);
        return true;
    };

    useEffect(() => {
        fetchQuota();
    }, [userId]);

    return {
        quota,
        loading,
        incrementVideoCount: handleIncrementVideoCount,
        remainingVideos: quota ? quota.max_videos - quota.video_count : 0
    };
} 