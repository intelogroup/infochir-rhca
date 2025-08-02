
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
    let isMounted = true;

    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AdminAuth] Error getting initial session:', error);
          if (isMounted) {
            setError(error);
            setIsLoading(false);
          }
          return;
        }

        console.log('[AdminAuth] Initial session check:', session?.user?.email || 'No session');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AdminAuth] Exception getting initial session:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AdminAuth] Auth state changed:', event, session?.user?.email || 'No session');
        
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null); // Clear any previous errors on auth state change
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
          
          // Log security event for failed admin check
          try {
            await supabase.rpc('log_security_event', {
              event_type_param: 'admin_role_check_failed',
              event_data_param: { 
                user_id: user.id,
                error: error.message
              }
            });
          } catch (e) {
            console.error('Failed to log security event:', e);
          }
          
          throw error;
        }

        console.log('[AdminAuth] Admin role check result:', data);
        
        // Log successful admin access
        if (data) {
          try {
            await supabase.rpc('log_security_event', {
              event_type_param: 'admin_access_granted',
              event_data_param: { 
                user_id: user.id,
                email: user.email
              }
            });
          } catch (e) {
            console.error('Failed to log security event:', e);
          }
        }
        
        return data as boolean;
      } catch (err) {
        console.error('[AdminAuth] Error checking admin role:', err);
        throw err;
      }
    },
    enabled: !!user && !!session, // Only run when we have both user and session
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
    isLoading: isLoading || (!!session && isRoleLoading), // Only show role loading if we have a session
    error,
    isAuthenticated: !!session && !!user
  };
};
