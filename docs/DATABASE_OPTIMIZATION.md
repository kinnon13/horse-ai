# Database Optimization Guide

This document covers database optimization strategies for the HorseGPT application, including connection pooling, indexing, and query optimization.

## Table of Contents
1. [Supabase Connection Pooling](#supabase-connection-pooling)
2. [Read Replica Configuration](#read-replica-configuration)
3. [Query Optimization Tips](#query-optimization-tips)
4. [Index Strategy](#index-strategy)
5. [Performance Monitoring](#performance-monitoring)

## Supabase Connection Pooling

### Overview
Connection pooling allows multiple clients to share a pool of database connections, reducing connection overhead and improving performance.

### Setup

#### 1. Transaction Pool Mode (Recommended for most apps)
```javascript
// Use connection string with session mode (default)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Session mode is default - each client gets its own connection
const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 2. Direct Connection (For server-side only)
For server-side operations, use direct connection:
```javascript
// Use service role key (server-side only)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
)
```

### Best Practices
- **Use connection pooling in production**: Reduces connection overhead
- **Limit concurrent connections**: Monitor connection count in Supabase dashboard
- **Reuse client instances**: Don't create new clients for each request
- **Use transaction pool for high-traffic**: Consider PgBouncer for connection pooling

### Connection String Format
```
# Session mode (default)
postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# Transaction mode (for pooling)
postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

## Read Replica Configuration

### When to Use Read Replicas
- High read-to-write ratio (80/20 or higher)
- Geographic distribution of users
- Analytics/reporting workloads
- Separating OLTP from OLAP workloads

### Supabase Read Replicas
Supabase automatically handles read replicas for Pro plan and above:
- **Automatic failover**: Seamless transition if primary fails
- **Replication lag**: Typically <100ms
- **Read scaling**: Distribute read queries across replicas

### Implementation Example
```javascript
// Primary connection (writes)
const supabasePrimary = createClient(PRIMARY_URL, PRIMARY_KEY)

// Read replica (reads only)
const supabaseRead = createClient(اني_URL, READ_KEY, {
  db: { schema: 'public' }
})

// Route reads to replica, writes to primary
async function getHorses(userId) {
  return await supabaseRead
    .from('horses_master')
    .select('*')
    .eq('owner_id', userId)
}
```

### Best Practices
- **Separate read/write logic**: Use different clients for reads vs writes
- **Monitor replication lag**: Check Supabase dashboard for lag metrics
- **Use connection pooling with replicas**: Reduces connection overhead
- **Route analytics to replicas**: Keep reporting queries off primary

## Query Optimization Tips

### 1. Use Indexes Effectively
```sql
-- Good: Uses index on email
SELECT * FROM users WHERE email = 'user@example.com';

-- Bad: Full table scan (no index on phone)
SELECT * FROM users WHERE phone = '123-456-7890';
```

### 2. Limit Result Sets
```javascript
// Good: Limited results
const { data } = await supabase
  .from('horses_master')
  .select('冠軍, breed')
  .limit(100)

// Bad: Fetching entire table
const { data } = await supabase
  .from('horses_master')
  .select('*')
```

### 3. Use Selective Columns
```javascript
// Good: Only fetch needed columns
.select('id, name, breed')

// Bad: Fetch all columns
.select('*')
```

### 4. Optimize JOINs
```sql
-- Use indexes on join columns
-- Ensure foreign keys are indexed
CREATE INDEX idx_horses_owner_id ON horses(owner_id);
```

### 5. Use EXPLAIN to Analyze Queries
```sql
EXPLAIN ANALYZE
SELECT * FROM horses_master
WHERE breed = 'Quarter Horse'
AND reg_name ILIKE '%stallion%';
```

### 6. Avoid N+1 Queries
```javascript
// Bad: N+1 queries
for (const horse of horses) {
  const owner = await getOwner(horse.owner_id〜)
}

// Good: Batch query
const ownerIds = horses.map(h => h.owner_id)
const owners = await getOwners(ownerIds)
```

### 7. Use Pagination
```javascript
// Good: Paginated results
const { data } = await supabase
  .from('results_master')
  .select('*')
  .range(0, 49িন) // First 50

// Bad: Loading all records
const { data } = await supabase
  .from('results_master')
  .select('*')
```

## Index Strategy

### Performance Indexes Migration
The `add_performance_indexes.sql` migration adds indexes for:
- **users**: `email`, `tier` (login, filtering)
- **horses_master**: `reg_name`, `breed` (search, filtering)
- **results_master**: `horse_reg_name`, `event_date` (performance lookup)
- **providers**: `service_type`, `city`, `state` (provider search)

### When to Add Indexes
- **Foreign keys**: Always index foreign key columns
- **WHERE clauses**: Index columns used in WHERE conditions
- **JOIN columns**: Index columns used in JOINs
- **ORDER BY**: Consider indexes for sorted queries
- **Common filters**: Index frequently filtered columns

### Index Maintenance
```sql
-- Rebuild indexes (periodically, e.g., weekly)
REINDEX TABLE horses_master;

-- Update statistics
ANALYZE horses_master;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## Performance Monitoring

### Supabase Dashboard Metrics
Monitor in Supabase dashboard:
- **Query performance**: Slow query log
- **Connection count**: Active connections
- **Database size**: Storage usage
- **Replication lag**: Read replica lag

### Query Performance Analysis
```sql
-- Find slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Best Practices Summary
1. **Use indexes**: Index foreign keys and frequently queried columns
2. **Limit results**: Use pagination and selective column fetching
3. **Monitor performance**: Regularly check slow queries
4. **Optimize JOINs**: Ensure join columns are indexed
5. **Use connection pooling**: Reduces connection overhead
6. **Route reads to replicas**: For high read workloads
7. **Avoid N+1 queries**: Use batch queries instead
8. **Analyze queries**: Use EXPLAIN to understand query plans
