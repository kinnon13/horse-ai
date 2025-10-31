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
