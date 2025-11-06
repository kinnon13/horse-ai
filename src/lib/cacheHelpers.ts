// Queries: paginated with limit
export function getUserCacheKey(userId: string): string {
  return `user:${userId}`
}

export function getHorseCacheKey(horseId: string): string {
  return `horse:${horseId}`
}

export function getUserHorsesCacheKey(userId: string): string {
  return `user:${userId}:horses`
}

export function getSearchResultsCacheKey(query: string, filters: string): string {
  const hash = Buffer.from(`${query}:${filters}`).toString('base64').slice(0, 16)
  return `search:${hash}`
}

export function getProviderCacheKey(providerId: string): string {
  return `provider:${providerId}`
}

export function getServiceRequestCacheKey(requestId: string): string {
  return `service_request:${requestId}`
}

export function getNearbyProvidersCacheKey(lat: number, lng: number, radius: number): string {
  return `providers:nearby:${lat.toFixed(2)}:${lng.toFixed(2)}:${radius}`
}

