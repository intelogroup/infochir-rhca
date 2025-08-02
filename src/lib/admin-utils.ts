
import { supabase } from '@/integrations/supabase/client';

// Input validation for admin operations
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const assignAdminRole = async (email: string): Promise<boolean> => {
  try {
    // Validate input
    if (!email || !validateEmail(email)) {
      console.error('Invalid email provided for admin role assignment');
      return false;
    }

    // Sanitize email input
    const sanitizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.rpc('assign_admin_role_by_email', {
      _email: sanitizedEmail
    });

    if (error) {
      console.error('Error assigning admin role:', error);
      
      // Log security event for failed admin assignment
      await supabase.rpc('log_security_event', {
        event_type_param: 'admin_role_assignment_failed',
        event_data_param: { 
          target_email: sanitizedEmail,
          error: error.message
        }
      });
      
      return false;
    }

    // Log successful admin assignment
    await supabase.rpc('log_security_event', {
      event_type_param: 'admin_role_assigned',
      event_data_param: { 
        target_email: sanitizedEmail
      }
    });

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
