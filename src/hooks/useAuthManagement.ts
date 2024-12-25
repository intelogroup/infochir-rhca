import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthManagement = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    isLoading: true,
    error: null,
  });

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminError && adminError.code !== 'PGRST116') {
        console.error("Error checking admin status:", adminError);
        return false;
      }

      return !!adminData;
    } catch (error) {
      console.error("Error in admin check:", error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user && mounted) {
          const isAdmin = await checkAdminStatus(user.id);
          setAuthState({
            user,
            isAdmin,
            isLoading: false,
            error: null,
          });
        } else if (mounted) {
          setAuthState({
            user: null,
            isAdmin: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (mounted) {
          setAuthState({
            user: null,
            isAdmin: false,
            isLoading: false,
            error: error instanceof Error ? error.message : "Authentication error occurred",
          });
          toast.error("Authentication error occurred");
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setAuthState({
          user: session.user,
          isAdmin,
          isLoading: false,
          error: null,
        });
        toast.success("Successfully signed in!");
      } else if (event === 'SIGNED_OUT' && mounted) {
        setAuthState({
          user: null,
          isAdmin: false,
          isLoading: false,
          error: null,
        });
        toast.info("Signed out");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return { ...authState, signOut };
};