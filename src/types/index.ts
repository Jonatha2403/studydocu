// src/types/index.ts

export interface UserProfile {
  id: string
  username?: string
  avatar_url?: string
  puntos?: number
  role?: 'user' | 'admin' | string
}

// Perfil completo del usuario usado en el contexto
export interface PerfilExtendido {
  id: string
  username?: string
  puntos?: number // ✅ unificado con UserProfile
  subscription_active?: boolean
  universidad?: string
  nivel?: string
  medalla?: string
  nombre?: string
  carrera?: string
  avatar_url?: string
  role?: string
  subscription_status?: 'Activa' | 'Inactiva' | string

  // ✅ Propiedades usadas en el Navbar y otras vistas
  has_new_rewards?: boolean
  verificado?: boolean
}

// Comentarios asociados a un documento, incluye parte del perfil
export interface Comment {
  id: string
  created_at: string
  content: string
  user_id: string
  document_id: string
  profiles?: {
    username?: string
    avatar_url?: string
    subscription_active?: boolean
  }
}
