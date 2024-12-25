import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted && session) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminError) {
            console.error("Error checking admin status:", adminError);
          }

          setAuthState({
            isAuthenticated: true,
            isAdmin: !!adminData,
            isLoading: false,
          });
        } else if (mounted) {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (adminError) {
              console.error("Error checking admin status:", adminError);
            }

            if (mounted) {
              setAuthState({
                isAuthenticated: true,
                isAdmin: !!adminData,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
            if (mounted) {
              setAuthState({
                isAuthenticated: true,
                isAdmin: false,
                isLoading: false,
              });
            }
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};