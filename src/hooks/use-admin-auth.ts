
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { data: isAdmin = false, isLoading: isRoleLoading } = useQuery({
    queryKey: ['admin-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!supabase.auth.getSession(),
  });

  useEffect(() => {
    setIsLoading(isRoleLoading);
  }, [isRoleLoading]);

  return {
    isAdmin,
    isLoading,
  };
};
