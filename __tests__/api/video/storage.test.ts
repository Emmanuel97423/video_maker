import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { createClientForServer } from '@/utils/supabase/server';
import { createClient } from '@supabase/supabase-js';

// Mock des modules Next.js
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, options?: { status?: number }) => ({
        status: options?.status || 200,
        json: () => Promise.resolve(body),
        headers: new Map(),
        ok: (options?.status || 200) < 400
      })
    },
    NextRequest: class {
      constructor(public url: string, public options: any) {}
      async json() {
        return Promise.resolve(
          typeof this.options.body === 'string' 
            ? JSON.parse(this.options.body) 
            : this.options.body
        );
      }
    }
  };
});

// Import après le mock
import { POST } from '@/app/api/video/storage/route';

// Mock des dépendances
vi.mock('@/utils/supabase/server', () => ({
  createClientForServer: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

// Fonction utilitaire pour créer une requête NextRequest
function createNextRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/video/storage', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Définir les variables d'environnement pour les tests
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test-supabase-url.supabase.co');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key');

describe('API Route: /api/video/storage', () => {
  // Configuration avant chaque test
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock de l'utilisateur authentifié
    vi.mocked(createClientForServer).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
          error: null,
        }),
      },
    } as any);
    
    // Mock du client Supabase
    const mockSupabaseClient = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/video.mp4' } }),
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'test-video-id' }, error: null }),
      }),
    };
    
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
    
    // Mock de fetch pour simuler le téléchargement de la vidéo
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue({
        size: 1024 * 1024, // 1MB
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(1024 * 1024)),
      }),
    } as any);
  });

  it('devrait retourner 400 si les données requises sont manquantes', async () => {
    const req = createNextRequest({});
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Données manquantes');
  });

  it('devrait retourner 401 si l\'utilisateur n\'est pas authentifié', async () => {
    vi.mocked(createClientForServer).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Non authentifié' },
        }),
      },
    } as any);
    
    const req = createNextRequest({ videoUrl: 'https://example.com/video.mp4', taskId: 'test-task-id' });
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(401);
    expect(data.error).toBe('Non authentifié');
  });

  it('devrait retourner 400 si la taille du fichier dépasse la limite', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue({
        size: 100 * 1024 * 1024, // 100MB (dépasse la limite de 50MB)
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(100 * 1024 * 1024)),
      }),
    } as any);
    
    const req = createNextRequest({ videoUrl: 'https://example.com/video.mp4', taskId: 'test-task-id' });
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toContain('dépasse la limite autorisée');
  });

  it('devrait mettre à jour une entrée existante si elle existe', async () => {
    // Simuler une entrée existante
    const mockSupabaseClient = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/video.mp4' } }),
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'existing-video-id' } }),
        update: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'updated-video-id' }, error: null }),
      }),
    };
    
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
    
    const req = createNextRequest({ videoUrl: 'https://example.com/video.mp4', taskId: 'test-task-id' });
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.url).toBe('https://example.com/video.mp4');
    expect(mockSupabaseClient.from().update).toHaveBeenCalled();
  });

  it('devrait créer une nouvelle entrée si elle n\'existe pas', async () => {
    const req = createNextRequest({ videoUrl: 'https://example.com/video.mp4', taskId: 'test-task-id' });
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.url).toBe('https://example.com/video.mp4');
    
    // Vérifier que l'insertion a été appelée
    const mockSupabaseClient = vi.mocked(createClient).mock.results[0].value;
    expect(mockSupabaseClient.from().insert).toHaveBeenCalled();
  });

  it('devrait gérer les erreurs lors de l\'upload vers Supabase Storage', async () => {
    // Simuler une erreur de stockage
    const mockSupabaseClient = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: null, error: { message: 'Erreur de stockage' } }),
          getPublicUrl: vi.fn(),
        }),
      },
      from: vi.fn(),
    };
    
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any);
    
    const req = createNextRequest({ videoUrl: 'https://example.com/video.mp4', taskId: 'test-task-id' });
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('Erreur de stockage');
  });
  
  it('devrait inclure l\'URL de l\'image dans la réponse', async () => {
    const req = createNextRequest({ 
      videoUrl: 'https://example.com/video.mp4', 
      taskId: 'test-task-id',
      imageUrl: 'https://example.com/image.jpg'
    });
    
    const response = await POST(req);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.url).toBe('https://example.com/video.mp4');
    expect(data.imageUrl).toBe('https://example.com/image.jpg');
  });
}); 