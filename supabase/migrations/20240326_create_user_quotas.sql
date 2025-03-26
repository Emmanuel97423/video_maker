-- Création du type enum pour les plans
CREATE TYPE plan_type AS ENUM ('FREE', 'STARTER', 'PREMIUM', 'ENTREPRISE');

-- Création de la table user_quotas
CREATE TABLE IF NOT EXISTS public.user_quotas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_count INTEGER NOT NULL DEFAULT 0,
    max_videos INTEGER NOT NULL DEFAULT 5,
    reset_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    plan plan_type NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT video_count_non_negative CHECK (video_count >= 0),
    CONSTRAINT max_videos_positive CHECK (max_videos > 0),
    CONSTRAINT user_quota_unique UNIQUE (user_id)
);

-- Création d'un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_quotas_updated_at
    BEFORE UPDATE ON public.user_quotas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Création de la fonction RPC pour incrémenter le compteur de vidéos
CREATE OR REPLACE FUNCTION increment_video_count(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE user_quotas
    SET 
        video_count = video_count + 1,
        updated_at = NOW()
    WHERE user_id = user_id_param;
END;
$$;

-- Permissions RLS (Row Level Security)
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir uniquement leur quota
CREATE POLICY "Users can view own quota"
    ON public.user_quotas
    FOR SELECT
    USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leur quota
CREATE POLICY "Users can update own quota"
    ON public.user_quotas
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique pour permettre l'insertion initiale du quota
CREATE POLICY "Users can insert own quota"
    ON public.user_quotas
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON public.user_quotas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quotas_reset_date ON public.user_quotas(reset_date);

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE public.user_quotas IS 'Table de gestion des quotas utilisateurs pour la génération de vidéos';
COMMENT ON COLUMN public.user_quotas.video_count IS 'Nombre de vidéos générées dans la période actuelle';
COMMENT ON COLUMN public.user_quotas.max_videos IS 'Nombre maximum de vidéos autorisées selon le plan';
COMMENT ON COLUMN public.user_quotas.reset_date IS 'Date de réinitialisation du compteur de vidéos';
COMMENT ON COLUMN public.user_quotas.plan IS 'Plan de l''utilisateur (FREE, STARTER, PREMIUM, ENTREPRISE)'; 