import { VideoGenerationPayload, VideoGenerationResponse, VideoStatusResponse, FileResponse, MINIMAX_API_STATUS } from './types';
import { UNIFIED_STATUS } from '../types/video-service';

export class VideoService {
  private static API_BASE_URL = 'https://api.minimaxi.chat/v1';
  private static API_KEY = process.env.NEXT_PUBLIC_MINIMAXI_API_KEY;

  private static getHeaders() {
    return {
      'authorization': `Bearer ${VideoService.API_KEY}`,
      'content-type': 'application/json',
    };
  }

  private static mapStatus(minimaxStatus: string): string {
    switch (minimaxStatus) {
      case MINIMAX_API_STATUS.PREPARING:
      case MINIMAX_API_STATUS.QUEUEING:
        return UNIFIED_STATUS.PENDING;
      case MINIMAX_API_STATUS.PROCESSING:
        return UNIFIED_STATUS.PROCESSING;
      case MINIMAX_API_STATUS.SUCCESS:
        return UNIFIED_STATUS.COMPLETED;
      case MINIMAX_API_STATUS.FAIL:
        return UNIFIED_STATUS.FAILED;
      default:
        return UNIFIED_STATUS.FAILED;
    }
  }

  private static async imageToBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Échec de la conversion en base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static async invokeVideoGeneration(imageUrl: string, prompt: string): Promise<string> {
    const base64Image = await this.imageToBase64(imageUrl);
    
    const payload: VideoGenerationPayload = {
      model: 'I2V-01-Director',
      prompt: `[Pan right]${prompt}`,
      first_frame_image: base64Image
    };

    const response = await fetch(`${VideoService.API_BASE_URL}/video_generation`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Échec de la génération de vidéo');
    }

    const data: VideoGenerationResponse = await response.json();
    
    if (data.base_resp.status_code !== 0) {
      throw new Error(data.base_resp.status_msg || 'Échec de la génération de vidéo');
    }

    return data.task_id;
  }

  static async queryVideoGeneration(taskId: string) {
    const response = await fetch(`${VideoService.API_BASE_URL}/query/video_generation?task_id=${taskId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération du statut');
    }

    const data: VideoStatusResponse = await response.json();
    console.log('Réponse de queryVideoGeneration:', data);

    if (data.base_resp.status_code !== 0) {
      throw new Error(data.base_resp.status_msg || 'Échec de la récupération du statut');
    }

    return {
      status: this.mapStatus(data.status),
      fileId: data.file_id,
      error: data.error_message
    };
  }

  static async fetchVideoResult(fileId: string): Promise<string> {
    console.log('Récupération de la vidéo avec fileId:', fileId);
    const response = await fetch(`${VideoService.API_BASE_URL}/files/retrieve?file_id=${fileId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Échec de la récupération de la vidéo');
    }

    const data: FileResponse = await response.json();
    console.log('Réponse de fetchVideoResult:', data);

    if (data.base_resp.status_code !== 0) {
      throw new Error(data.base_resp.status_msg || 'Échec de la récupération de la vidéo');
    }

    if (!data.file?.download_url) {
      throw new Error('URL de la vidéo non disponible');
    }

    return data.file.download_url;
  }
} 