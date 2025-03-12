/**
 * Types pour le service vidéo Kling
 */

// Statuts possibles pour une tâche Kling
export type KlingTaskStatus = 'submitted' | 'processing' | 'succeed' | 'failed';

// Mapping des statuts Kling vers les statuts de l'application
export const VIDEO_GENERATION_STATUS = {
    SUBMITTED: 'submitted' as const,
    PROCESSING: 'processing' as const,
    SUCCESS: 'succeed' as const,
    FAILED: 'failed' as const,
} as const;

export type VideoGenerationStatus = typeof VIDEO_GENERATION_STATUS[keyof typeof VIDEO_GENERATION_STATUS];

// Interface pour la configuration de la requête vidéo
export interface KlingVideoRequest {
    model_name: string;
    mode: 'std' | 'pro';
    duration: string;
    image: string;
    prompt?: string;
    cfg_scale?: number;
}

// Interface pour la réponse générique de l'API Kling
export interface KlingResponse<T> {
    code: number;
    message: string;
    data: T;
}

// Interface pour les erreurs de l'API Kling
export interface KlingErrorResponse {
    ResponseMeta: {
        ErrorCode: string;
        ErrorMessage: string;
    };
}

// Interface pour la réponse de création de tâche
export interface KlingTaskResponse {
    task_id: string;
}

// Interface pour le résultat d'une vidéo
export interface KlingVideoResult {
    id: string;
    url: string;
    duration: string;
}

// Interface pour le statut d'une tâche
export interface KlingTaskStatusResponse {
    task_id: string;
    task_status: KlingTaskStatus;
    task_status_msg: string;
    task_result?: {
        videos: KlingVideoResult[];
    };
}

// Interface pour le résultat de la génération
export interface VideoGenerationResult {
    status: VideoGenerationStatus;
    fileId?: string;
    message?: string;
} 