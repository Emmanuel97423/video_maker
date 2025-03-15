export interface IVideoService {
  invokeVideoGeneration(imageUrl: string, prompt: string): Promise<string>;
  queryVideoGeneration(taskId: string): Promise<{ status: string; fileId?: string }>;
  fetchVideoResult(fileId: string): Promise<string>;
}

export type VideoServiceProvider = 'kling' | 'minimax';

export interface VideoGenerationStatus {
  status: string;
  fileId?: string;
  videoUrl?: string;
  error?: string;
}

// Statuts Kling
export const KLING_STATUS = {
  SUBMITTED: 'submitted',
  PROCESSING: 'processing',
  SUCCESS: 'succeed',
  FAILED: 'failed',
} as const;

// Statuts Minimax
export const MINIMAX_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Statuts unifiés
export const UNIFIED_STATUS = {
  IDLE: 'idle',
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  SUCCESS: 'succeed',
  FAILED: 'failed',
} as const;

export type UnifiedStatus = typeof UNIFIED_STATUS[keyof typeof UNIFIED_STATUS]; 