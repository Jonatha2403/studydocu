export function getCleanAvatarUrl(url?: string | null) {
  return url ? url.split('?')[0] : ''
}

export function isLottieAvatar(url?: string | null) {
  return getCleanAvatarUrl(url).toLowerCase().endsWith('.json')
}

export function getAvatarImageSrc(url?: string | null, updatedAt?: string | number | null) {
  if (!url || isLottieAvatar(url)) return undefined
  const version = updatedAt ? new Date(updatedAt).getTime() : Date.now()
  return `${url}${url.includes('?') ? '&' : '?'}v=${version}`
}
