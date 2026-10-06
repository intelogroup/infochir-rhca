import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const fetchAdminSummary = async () => {
  const { data, error } = await supabase.from('admin_analytics_summary').select('*').single();
  if (error) throw error;
  // View counts source='ADC' as total_index_medicus; count real INDEX rows until the view is fixed.
  const { count, error: countError } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('source', 'INDEX');
  if (countError) throw countError;
  return { ...data, total_index_medicus: count ?? 0 };
};

export const useAdminSummary = () =>
  useQuery({ queryKey: ['admin-analytics-summary'], queryFn: fetchAdminSummary });

export const fmt = (n?: number | null) => (n ?? 0).toLocaleString('fr-FR');
