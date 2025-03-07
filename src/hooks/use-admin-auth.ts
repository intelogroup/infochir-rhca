
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
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }
        
        if (!user) {
          return false;
        }

        const { data, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "not found" which is expected if user isn't admin
          throw roleError;
        }

        return !!data;
      } catch (err) {
        console.error('Error checking admin role:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
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
