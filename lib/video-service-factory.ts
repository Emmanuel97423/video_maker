import { KlingVideoService } from './kling/video-service';
import { VideoService as MinimaxVideoService } from './minimaxi/video-service';
import { IVideoService, VideoServiceProvider } from './types/video-service';

class VideoServiceFactory {
  private static instance: VideoServiceFactory;
  private currentProvider: VideoServiceProvider = 'kling';

  private constructor() {}

  public static getInstance(): VideoServiceFactory {
    if (!VideoServiceFactory.instance) {
      VideoServiceFactory.instance = new VideoServiceFactory();
    }
    return VideoServiceFactory.instance;
  }

  public setProvider(provider: VideoServiceProvider) {
    this.currentProvider = provider;
  }

  public getCurrentProvider(): VideoServiceProvider {
    return this.currentProvider;
  }

  public getService(): IVideoService {
    switch (this.currentProvider) {
      case 'kling':
        return KlingVideoService;
      case 'minimax':
        return MinimaxVideoService;
      default:
        throw new Error(`Provider ${this.currentProvider} non supporté`);
    }
  }
}

export const videoServiceFactory = VideoServiceFactory.getInstance(); 