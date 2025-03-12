import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { KlingVideoService } from '@/lib/kling/video-service';
import { toast } from 'sonner';
import { VIDEO_GENERATION_MINIMAX_STATUS } from '@/lib/minimaxi/types';

// Mock des dépendances
vi.mock('@/lib/kling/video-service', () => ({
  KlingVideoService: {
    invokeVideoGeneration: vi.fn(),
    queryVideoGeneration: vi.fn(),
  },
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de fetch
global.fetch = vi.fn();

describe('useVideoGeneration Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock de fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.com/video.mp4' }),
    });
  });

  it('devrait initialiser avec les valeurs par défaut', () => {
    const { result } = renderHook(() => useVideoGeneration());
    
    expect(result.current.status).toBe('');
    expect(result.current.downloadUrl).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.provider).toBe('kling');
    expect(result.current.message).toBe('');
    expect(result.current.progress).toBe(0);
  });

  it('devrait mettre à jour le statut lors de la génération de vidéo', async () => {
    // Configuration des mocks avec succès
    vi.mocked(KlingVideoService.invokeVideoGeneration).mockResolvedValue('test-task-id');
    vi.mocked(KlingVideoService.queryVideoGeneration).mockResolvedValue({
      status: VIDEO_GENERATION_MINIMAX_STATUS.SUCCESS,
      message: 'Génération terminée',
      fileId: 'test-file-id'
    });

    const { result } = renderHook(() => useVideoGeneration());

    await act(async () => {
      // Démarrer la génération
      const promise = result.current.generateVideo('test.jpg', 'test');
      
      // Vérifier l'état initial immédiatement
      expect(result.current.isLoading).toBe(true);
      expect(result.current.status).toBe('');

      // Attendre la fin de la génération
      await promise;
    });

    // Vérifier l'état final
    expect(result.current.status).toBe(VIDEO_GENERATION_MINIMAX_STATUS.SUCCESS);
    expect(result.current.isLoading).toBe(false);
  });

  it('devrait gérer les erreurs lors de la génération de vidéo', async () => {
    const testError = new Error('Test error');
    vi.mocked(KlingVideoService.invokeVideoGeneration).mockRejectedValue(testError);

    const { result } = renderHook(() => useVideoGeneration());

    await act(async () => {
      // Démarrer la génération
      const promise = result.current.generateVideo('test.jpg', 'test');
      
      // Vérifier l'état initial immédiatement
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('');

      try {
        await promise;
      } catch (error) {
        // Erreur attendue
      }
    });

    // Vérifier l'état final
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Test error');
    expect(result.current.status).toBe('failed');
  });

  it('devrait avoir une méthode de sauvegarde', () => {
    const { result } = renderHook(() => useVideoGeneration());
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.save).toBe('function');
  });
}); 