export type AchievementDef = {
  key: string
  title: string
  description: string
  icon: 'trophy' | 'star' | 'graduation' | 'book'
  difficulty: number
}

export const ACHIEVEMENTS_CATALOG: AchievementDef[] = [
  {
    key: 'bienvenida',
    title: 'Bienvenida',
    description: 'Completaste tu onboarding inicial.',
    icon: 'graduation',
    difficulty: 1,
  },
  {
    key: 'primer_login',
    title: 'Primer Login',
    description: 'Iniciaste sesion y entraste al dashboard.',
    icon: 'star',
    difficulty: 1,
  },
  {
    key: 'first_upload',
    title: 'Primer Documento',
    description: 'Subiste tu primer archivo.',
    icon: 'book',
    difficulty: 2,
  },
  {
    key: 'five_uploads',
    title: 'Colaborador Activo',
    description: 'Subiste 5 documentos a la plataforma.',
    icon: 'trophy',
    difficulty: 3,
  },
  {
    key: 'popular_doc',
    title: 'Documento Popular',
    description: 'Un documento tuyo alcanzo 10 likes.',
    icon: 'star',
    difficulty: 4,
  },
  {
    key: 'primer_documento',
    title: 'Primer Documento (Legacy)',
    description: 'Logro historico de primera subida.',
    icon: 'book',
    difficulty: 2,
  },
]

export function getAchievementMeta(key: string) {
  return ACHIEVEMENTS_CATALOG.find((a) => a.key === key)
}
