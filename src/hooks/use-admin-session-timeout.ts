import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useAdminSessionTimeout = (isAdmin: boolean, user: any) => {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Reset activity timer
  const resetActivity = useCallback(() => {
    if (isAdmin) {
      setLastActivity(Date.now());
      setShowWarning(false);
    }
  }, [isAdmin]);

  // Handle logout
  const handleLogout = useCallback(async (reason: 'timeout' | 'manual' = 'manual') => {
    try {
      await supabase.auth.signOut();
      
      // Log security event
      await supabase.rpc('log_security_event', {
        event_type_param: reason === 'timeout' ? 'admin_session_timeout' : 'admin_logout',
        event_data_param: { 
          user_id: user?.id,
          email: user?.email,
          reason
        }
      });
      
      if (reason === 'timeout') {
        toast.error("Session expirée", {
          description: "Votre session d'administration a expiré pour des raisons de sécurité"
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [user]);

  // Check session timeout
  useEffect(() => {
    if (!isAdmin) return;

    const checkTimeout = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity >= ADMIN_SESSION_TIMEOUT) {
        setIsSessionExpired(true);
        handleLogout('timeout');
      } else if (timeSinceActivity >= ADMIN_SESSION_TIMEOUT - WARNING_TIME && !showWarning) {
        setShowWarning(true);
        toast.warning("Session expire bientôt", {
          description: "Votre session d'administration expirera dans 5 minutes. Activité détectée pour prolonger.",
          duration: 10000,
        });
      }
    };

    const interval = setInterval(checkTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAdmin, lastActivity, showWarning, handleLogout]);

  // Listen for user activity
  useEffect(() => {
    if (!isAdmin) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity, true);
      });
    };
  }, [isAdmin, resetActivity]);

  return {
    showWarning,
    isSessionExpired,
    resetActivity,
    timeRemaining: ADMIN_SESSION_TIMEOUT - (Date.now() - lastActivity),
    handleLogout
  };
};