export interface VideoGenerationResponse {
  task_id: string;
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export interface VideoStatusResponse {
  task_id: string;
  status: 'Preparing' | 'Queueing' | 'Processing' | 'Success' | 'Fail';
  file_id?: string;
  video_url?: string;
  video_width?: number;
  video_height?: number;
  error_message?: string;
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export interface FileResponse {
  file: {
    download_url: string;
    file_id: string;
    file_name?: string;
    file_size?: number;
  };
  base_resp: {
    status_code: number;
    status_msg: string;
  };
}

export interface VideoGenerationPayload {
  model: string;
  prompt: string;
  first_frame_image: string;
}

// Constantes de statut Minimax
export const MINIMAX_API_STATUS = {
  PREPARING: 'Preparing',
  QUEUEING: 'Queueing',
  PROCESSING: 'Processing',
  SUCCESS: 'Success',
  FAIL: 'Fail',
} as const; 