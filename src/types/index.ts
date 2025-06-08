// src/types/index.ts

export interface UserProfile {
  id: string
  username?: string
  avatar_url?: string
  puntos?: number
  role?: 'user' | 'admin' | string
}

export interface PerfilExtendido {
  id: string
  username?: string
  puntos?: number
  suscripcion_activa?: boolean
  universidad?: string
  nivel?: string
  medalla?: string
  nombre?: string
  carrera?: string
  avatar_url?: string
  role?: string
  subscription_status?: 'Activa' | 'Inactiva' | string
}

export interface Comment {
  id: string
  created_at: string
  content: string
  user_id: string
  document_id: string
  profiles?: {
    username?: string
    avatar_url?: string
    suscripcion_activa?: boolean
  }
}
