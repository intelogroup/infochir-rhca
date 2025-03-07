
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: isAdmin = false, isLoading: isRoleLoading, error: queryError } = useQuery({
    queryKey: ['admin-role'],
    queryFn: async () => {
      try {
        // First check if the user is logged in
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('[AdminAuth] Error getting user:', userError);
          throw userError;
        }
        
        if (!user) {
          console.log('[AdminAuth] No user found, not authenticated');
          return false;
        }

        console.log('[AdminAuth] Checking admin role for user ID:', user.id);
        
        // Check if user has admin role
        const { data, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected if user isn't admin
          console.error('[AdminAuth] Error checking admin role:', roleError);
          throw roleError;
        }

        console.log('[AdminAuth] Admin role check result:', !!data);
        return !!data;
      } catch (err) {
        console.error('[AdminAuth] Error checking admin role:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!supabase.auth.getSession()
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError instanceof Error ? queryError : new Error(String(queryError)));
    }
    setIsLoading(isRoleLoading);
  }, [isRoleLoading, queryError]);

  return {
    isAdmin,
    isLoading,
    error
  };
};
