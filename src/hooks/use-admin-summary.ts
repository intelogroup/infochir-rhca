import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminSummary = () =>
  useQuery({
    queryKey: ['admin-analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase.from('admin_analytics_summary').select('*').single();
      if (error) throw error;
      return data;
    },
  });

export const fmt = (n?: number | null) => (n ?? 0).toLocaleString('fr-FR');
