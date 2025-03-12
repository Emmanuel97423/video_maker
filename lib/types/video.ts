/**
 * Types pour la gestion des vidéos
 */

import { KlingTaskStatus } from "./kling";

// Statuts possibles pour une vidéo
export type VideoStatus = KlingTaskStatus;


// Interface pour les données de base d'une vidéo
export interface VideoData {
    id?: string;
    task_id: string;
    user_id: string;
    image_url: string;
    video_url?: string;
    status: VideoStatus;
    title?: string;
    prompt?: string;
    provider?: string;
    created_at?: string;
    updated_at?: string;
}

// Interface pour la requête PATCH
export interface UpdateVideoRequest {
    id: string;
    status: VideoStatus;
    video_url?: string;
}

// Interface pour la requête POST
export interface SaveVideoRequest {
    task_id: string;
    image_url: string;
    video_url?: string;
    status: VideoStatus;
    title?: string;
    prompt?: string;
    provider?: string;
}

// Interface pour les réponses API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
}

// Interface pour la réponse de l'API
export interface SaveVideoResponse {
    success: boolean;
    data?: VideoData;
    error?: string;
    details?: unknown;
}

// Interface pour les erreurs de validation
export interface ValidationError {
    field: string;
    message: string;
}

// Interface pour la réponse d'erreur
export interface ErrorResponse {
    success: false;
    error: string;
    details?: ValidationError[] | unknown;
} 