// Types communs partagés dans l'application
export type ID = string | number;

export interface Timestamp {
  created_at: Date;
  updated_at: Date;
}

export type Status = 'active' | 'inactive' | 'pending' | 'error'; 