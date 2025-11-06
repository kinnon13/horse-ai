// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// useAuthHelpers.ts (30 lines)
'use client'

import { supabase } from '@/lib/supabase-client';

export async function getUserTier(userId: string): Promise<'free' | 'plus' | 'pro'> {
  const { data } = await supabase
    .from('users')
    .select('tier')
    .eq('id', userId)
    .single();
  
  return data?.tier || 'free';
}
