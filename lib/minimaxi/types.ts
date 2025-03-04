export interface VideoGenerationResponse {
  task_id: string;
  status: string;
}

export interface FileResponse {
  file: {
    download_url: string;
  }
}

export interface VideoGenerationPayload {
  model: string;
  prompt: string;
  first_frame_image?: string;
}

export const VIDEO_GENERATION_STATUS = {
  PREPARING: 'Preparing',
  QUEUEING: 'Queueing',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
  FAIL: 'Fail',
} as const; 