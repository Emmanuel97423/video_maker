import { VideoGenerationPayload, VideoGenerationResponse, FileResponse } from './types';

export class VideoService {
  private static API_BASE_URL = 'https://api.minimaxi.chat/v1';
  private static API_KEY = process.env.NEXT_PUBLIC_MINIMAXI_API_KEY;

  private static getHeaders() {
    return {
      'authorization': `Bearer ${VideoService.API_KEY}`,
      'content-type': 'application/json',
    };
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
    return data.task_id;
  }

  static async queryVideoGeneration(taskId: string): Promise<{ fileId: string; status: string }> {
    const response = await fetch(
      `${VideoService.API_BASE_URL}/query/video_generation?task_id=${taskId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la requête de statut');
    }

    const data = await response.json();
    return {
      fileId: data.file_id || '',
      status: data.status,
    };
  }

  static async fetchVideoResult(fileId: string): Promise<string> {
    const response = await fetch(
      `${VideoService.API_BASE_URL}/files/retrieve?file_id=${fileId}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la récupération de la vidéo');
    }

    const data: FileResponse = await response.json();
    return data.file.download_url;
  }
} 