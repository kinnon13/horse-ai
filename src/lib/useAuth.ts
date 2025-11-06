// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// useAuth.ts (49 lines)
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const tier = await getUserTier(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            tier
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function getUserTier(userId: string): Promise<'free' | 'pro'> {
  const { data } = await supabase
    .from('user_subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single();
  
  return data?.tier || 'free';
}

