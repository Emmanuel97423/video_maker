import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

// Polyfills pour l'environnement de test
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock des variables d'environnement
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-supabase-url.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// Mock de fetch global
global.fetch = vi.fn();

// Mock de localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};

// Mock de TextEncoder/TextDecoder si nécessaire
if (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
} 