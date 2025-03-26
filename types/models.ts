import { ID, Timestamp } from './common';

// Exemple de type pour un utilisateur
export interface User extends Timestamp {
  id: ID;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Exemple de type pour une vidéo
export interface Video extends Timestamp {
  id: ID;
  title: string;
  description: string;
  url: string;
  user_id: ID;
  status: 'processing' | 'completed' | 'failed';
} 