
import { supabase } from '@/integrations/supabase/client';

export const assignAdminRole = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('assign_admin_role_by_email', {
      _email: email
    });

    if (error) {
      console.error('Error assigning admin role:', error);
      return false;
    }

    return data as boolean;
  } catch (error) {
    console.error('Error calling assign_admin_role_by_email function:', error);
    return false;
  }
};

export const checkUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user role:', error);
      return null;
    }

    return data?.role || 'user';
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};
