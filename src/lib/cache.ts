type CacheValue = string | object | number | boolean
interface CacheOptions {
  ttl?: number
}
export class CacheService {
  private client: any
  constructor() {
    const redisUrl = process.env.REDIS_URL
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
    this.client = upstashUrl && upstashToken
      ? { url: upstashUrl, token: upstashToken, type: 'upstash' }
      : redisUrl ? { url: redisUrl, type: 'redis' } : { type: 'memory' }
  }
  async getCached<T = CacheValue>(key: string): Promise<T | null> {
    try {
      if (this.client.type !== 'upstash') return null
      const res = await fetch(`${this.client.url}/get/${key}`, { headers: { Authorization: `Bearer ${this.client.token}` } })
      const data = await res.json()
      return data.result ? JSON.parse(data.result) : null
    } catch {
      return null
    }
  }
  async setCached(key: string, value: CacheValue, options: CacheOptions = {}): Promise<boolean> {
    try {
      if (this.client.type !== 'upstash') return false
      const serialized = JSON.stringify(value)
      const url = options.ttl
        ? `${this.client.url}/setex/${key}/${options.ttl}/${encodeURIComponent(serialized)}`
        : `${this.client.url}/set/${key}/${encodeURIComponent(serialized)}`
      await fetch(url, { headers: { Authorization: `Bearer ${this.client.token}` } })
      return true
    } catch {
      return false
    }
  }
  async deleteCached(key: string): Promise<boolean> {
    try {
      if (this.client.type !== 'upstash') return false
      await fetch(`${this.client.url}/del/${key}`, { headers: { Authorization: `Bearer ${this.client.token}` } })
      return true
    } catch {
      return false
    }
  }
}
export const cacheService = new CacheService()