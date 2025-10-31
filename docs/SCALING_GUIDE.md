# Scaling Guide

Comprehensive guide for scaling HorseGPT application to handle increased traffic and load.

## Table of Contents

1. [Database Scaling](#database-scaling)
2. [CDN Setup](#cdn-setup)
3. [Redis Caching](#redis-caching)
4. [Load Balancing](#load-balancing)
5. [Monitoring Setup](#monitoring-setup)
6. [Load Testing with k6](#load-testing-with-k6)
7. [Performance Optimization](#performance-optimization)

---

## Database Scaling

### Supabase Scaling Options

#### Read Replicas

Supabase supports read replicas for scaling read operations:

**Setup**:
1. Go to Supabase Dashboard → Database → Replicas
2. Create new read replica
3. Choose region closest to users
4. Update connection string in application

**Implementation**:

```typescript
// lib/supabase-read.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseRead = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_READ_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Use for read operations
const { data } = await supabaseRead.from('providers').select('*')
```

#### Connection Pooling

Enable Supabase connection pooling:

1. Go to Project Settings → Database
2. Enable "Connection Pooling"
3. Use pooler connection string:

```typescript
// Use pooler URL
const supabaseUrl = 'https://your-project.supabase.co'
// Pooler: your-project.supabase.co:6543
```

#### Database Indexing

Create indexes for frequently queried columns:

```sql
-- Example indexes for providers table
CREATE INDEX idx_providers_service_type ON providers(service_type);
CREATE INDEX idx_providers_city_state ON providers(city, state);
CREATE INDEX idx_providers_verified ON providers(verified) WHERE verified = true;

-- Composite index for common queries
CREATE INDEX idx_providers_location_service ON providers(city, state, service_type);
```

#### Query Optimization

```typescript
// ❌ Bad: Fetching all data
const { data } = await supabase.from('providers').select('*')

// ✅ Good: Select only needed fields
const { data } = await supabase
  .from('providers')
  .select('id, business_name, service_type, city')
  .eq('verified', true)
  .limit(50)
```

#### Sharding Strategy

For extremely high traffic, consider table sharding:

```sql
-- Shard by region (example)
CREATE TABLE providers_us_east AS 
  SELECT * FROM providers WHERE state IN ('NY', 'MA', 'FL');

CREATE TABLE providers_us_west AS 
  SELECT * FROM providers WHERE state IN ('CA', 'WA', 'OR');
```

---

## CDN Setup

### Cloudflare CDN

#### Initial Setup

1. Sign up at [Cloudflare](https://cloudflare.com)
2. Add your domain
3. Update nameservers at domain registrar
4. Wait for DNS propagation

#### Configuration

**Caching Rules**:

Create Page Rules in Cloudflare Dashboard:

1. **Static Assets** (Cache Everything):
   - URL Pattern: `yourdomain.com/_next/static/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 month

2. **API Routes** (Bypass Cache):
   - URL Pattern: `yourdomain.com/api/*`
   - Settings:
     - Cache Level: Bypass

3. **Images** (Cache):
   - URL Pattern: `yourdomain.com/images/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 week

#### Next.js Integration

In `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable static export caching
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

#### Cloudflare Workers (Edge Functions)

Deploy edge functions for geo-based routing:

```javascript
// cloudflare-worker.js
export default {
  async fetch(request) {
    const country = request.cf.country
    
    // Route to nearest Supabase region
    if (country === 'US') {
      return fetch('https://us-east.supabase.co', request)
    }
    
    return fetch('https://eu-west.supabase.co', request)
  }
}
```

---

## Redis Caching

### Setup Redis

#### Option 1: Upstash Redis (Serverless)

1. Sign up at [Upstash](https://upstash.com)
2. Create Redis database
3. Get connection string
4. Install client:

```bash
npm install @upstash/redis
```

**Implementation**:

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Cache providers
export async function getCachedProviders(filters: ProviderFilters) {
  const cacheKey = `providers:${JSON.stringify(filters)}`
  
  // Try cache first
  const cached = await redis.get(cacheKey)
  if (cached) return cached
  
  // Fetch from database
  const providers = await fetchProviders(filters)
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(providers))
  
  return providers
}
```

#### Option 2: Redis Cloud

1. Sign up at [Redis Cloud](https://redis.com/cloud)
2. Create database
3. Get connection details
4. Install client:

```bash
npm install redis
```

**Implementation**:

```typescript
// lib/redis.ts
import { createClient } from 'redis'

export const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.on('error', (err) => console.error('Redis Client Error', err))

await redisClient.connect()
```

### Cache Strategies

**Cache-Aside Pattern**:
```typescript
async function getProvider(id: string) {
  // 1. Check cache
  const cached = await redis.get(`provider:${id}`)
  if (cached) return JSON.parse(cached)
  
  // 2. Fetch from DB
  const provider = await fetchProviderFromDB(id)
  
  // 3. Update cache
  await redis.setex(`provider:${id}`, 3600, JSON.stringify(provider))
  
  return provider
}
```

**Write-Through Pattern**:
```typescript
async function updateProvider(id: string, data: any) {
  // 1. Update DB
  const provider = await updateProviderInDB(id, data)
  
  // 2. Update cache
  await redis.setex(`provider:${id}`, 3600, JSON.stringify(provider))
  
  return provider
}
```

---

## Load Balancing

### Vercel Edge Network

Vercel automatically provides:
- Global CDN with 100+ edge locations
- Automatic load balancing
- DDoS protection
- Edge middleware support

### Custom Load Balancer

For advanced setups, use AWS ALB or Cloudflare Load Balancer:

**Cloudflare Load Balancer**:
1. Go to Traffic → Load Balancing
2. Create pool with multiple origins
3. Configure health checks
4. Set up routing rules

### Application-Level Load Balancing

```typescript
// lib/load-balancer.ts
const regions = [
  'https://us-east.supabase.co',
  'https://eu-west.supabase.co',
  'https://ap-southeast.supabase.co',
]

function getOptimalRegion(): string {
  // Use geolocation or round-robin
  const index = Math.floor(Math.random() * regions.length)
  return regions[index]
}
```

---

## Monitoring Setup

### Application Performance Monitoring

#### Vercel Analytics

Enable in Project Settings:
- Real User Monitoring (RUM)
- Web Vitals tracking
- Core metrics dashboard

#### Sentry Integration

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

#### Custom Metrics

```typescript
// lib/metrics.ts
export function trackMetric(name: string, value: number) {
  // Send to analytics service
  fetch('https://analytics.yourdomain.com/metrics', {
    method: 'POST',
    body: JSON.stringify({ name, value, timestamp: Date.now() }),
  })
}

// Usage
trackMetric('api.response_time', 150)
trackMetric('db.query_count', 10)
```

### Database Monitoring

**Supabase Dashboard**:
- Query performance
- Connection pool usage
- Database size
- Replica lag

**Custom Queries**:
```sql
-- Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Load Testing with k6

### Installation

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Basic Load Test

Create `load-test.js`:

```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% errors
  },
}

export default function () {
  // Test homepage
  const res = http.get('https://yourdomain.com')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })
  
  // Test API endpoint
  const apiRes = http.get('https://yourdomain.com/api/providers')
  check(apiRes, {
    'API status is 200': (r) => r.status === 200,
  })
  
  sleep(1)
}
```

### Run Load Test

```bash
k6 run load-test.js
```

### Advanced Scenarios

**Test User Journey**:

```javascript
export default function () {
  // 1. Load homepage
  http.get('https://yourdomain.com')
  sleep(2)
  
  // 2. Search providers
  http.get('https://yourdomain.com/api/providers?service_type=farrier')
  sleep(1)
  
  // 3. View provider details
  http.get('https://yourdomain.com/api/providers/123')
  sleep(1)
  
  // 4. Submit form
  http.post('https://yourdomain.com/api/service-requests', 
    JSON.stringify({ service_type: 'farrier' }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
```

**Stress Test**:

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 500 },
    { duration: '1m', target: 500 },
    { duration: '10s', target: 1000 },
    { duration: '1m', target: 1000 },
    { duration: '10s', target: 0 },
  ],
}
```

---

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/horse-image.jpg"
  width={500}
  height={300}
  alt="Horse"
  priority // For above-fold images
/>
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})
```

### Database Query Optimization

```typescript
// Use select to limit fields
const { data } = await supabase
  .from('providers')
  .select('id, business_name') // Only needed fields

// Use pagination
const { data } = await supabase
  .from('providers')
  .select('*')
  .range(0, 49) // First 50 records
```

---

## Additional Resources

- [Supabase Scaling](https://supabase.com/docs/guides/platform/scaling)
- [Vercel Edge Network](https://vercel.com/docs/edge-network)
- [k6 Documentation](https://k6.io/docs/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

