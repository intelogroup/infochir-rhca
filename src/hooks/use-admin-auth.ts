
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { User, Session } from '@supabase/supabase-js';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AdminAuth] Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AdminAuth] Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user has admin role
  const { data: isAdmin = false, isLoading: isRoleLoading, error: queryError } = useQuery({
    queryKey: ['admin-role', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('[AdminAuth] No user found, not checking role');
        return false;
      }

      console.log('[AdminAuth] Checking admin role for user ID:', user.id);
      
      try {
        const { data, error } = await supabase.rpc('has_role', { _role: 'admin' });

        if (error) {
          console.error('[AdminAuth] Error checking admin role:', error);
          throw error;
        }

        console.log('[AdminAuth] Admin role check result:', data);
        return data as boolean;
      } catch (err) {
        console.error('[AdminAuth] Error checking admin role:', err);
        throw err;
      }
    },
    enabled: !!user,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError instanceof Error ? queryError : new Error(String(queryError)));
    }
  }, [queryError]);

  return {
    user,
    session,
    isAdmin,
    isLoading: isLoading || isRoleLoading,
    error,
    isAuthenticated: !!session
  };
};
