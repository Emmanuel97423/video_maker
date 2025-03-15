import { videoServiceFactory } from './video-service-factory';
import { VideoServiceProvider, VideoGenerationStatus } from './types/video-service';

export class UnifiedVideoService {
  static setProvider(provider: VideoServiceProvider) {
    videoServiceFactory.setProvider(provider);
  }

  static getCurrentProvider(): VideoServiceProvider {
    return videoServiceFactory.getCurrentProvider();
  }

  static async generateVideo(imageUrl: string, prompt: string): Promise<string> {
    const service = videoServiceFactory.getService();
    return service.invokeVideoGeneration(imageUrl, prompt);
  }

  static async checkVideoStatus(taskId: string): Promise<VideoGenerationStatus> {
    const service = videoServiceFactory.getService();
    const result = await service.queryVideoGeneration(taskId);
    return {
      status: result.status,
      fileId: result.fileId
    };
  }

  static async getVideoUrl(fileId: string): Promise<string> {
    const service = videoServiceFactory.getService();
    return service.fetchVideoResult(fileId);
  }
} 