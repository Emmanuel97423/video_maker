import { Database } from './types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Types pratiques pour les tables spécifiques
export type UserRow = Tables<'users'>
export type VideoRow = Tables<'videos'>
export type UserQuotaRow = Tables<'user_quotas'>

export type UserInsert = Inserts<'users'>
export type VideoInsert = Inserts<'videos'>
export type UserQuotaInsert = Inserts<'user_quotas'>

export type UserUpdate = Updates<'users'>
export type VideoUpdate = Updates<'videos'>
export type UserQuotaUpdate = Updates<'user_quotas'> 