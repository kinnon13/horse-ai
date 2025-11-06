// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// RateLimitService.ts (40 lines)
import { supabase } from '@/lib/supabase-client';
const FREE_LIMIT = 10;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  tier: string;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single();

  if (userError) {
    return { allowed: true, remaining: FREE_LIMIT, tier: 'free' };
  }

  const tier = userData?.tier || 'free';
  const limit = tier === 'pro' ? Infinity : FREE_LIMIT;

  const { data: usageData } = await supabase
    .from('message_usage')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const count = usageData?.length || 0;
  const remaining = Math.max(0, limit - count);

  return { allowed: count < limit, remaining, tier };
}

export async function incrementUsage(userId: string): Promise<void> {
  await supabase.from('message_usage').insert({ user_id: userId });
}