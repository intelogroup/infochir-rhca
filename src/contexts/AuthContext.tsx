import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("is_super_admin")
        .eq("user_id", userId)
        .maybeSingle();
      
      return !!data?.is_super_admin;
    } catch (err) {
      console.log("Admin check error:", err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (event: string, session: any) => {
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user);
            const adminStatus = await checkAdminStatus(session.user.id);
            setIsAdmin(adminStatus);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth change error:", err);
        setError(err instanceof Error ? err : new Error("Authentication error"));
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        checkAdminStatus(session.user.id)
          .then(adminStatus => {
            if (mounted) {
              setIsAdmin(adminStatus);
              setIsLoading(false);
            }
          })
          .catch(err => {
            console.error("Initial admin check error:", err);
            if (mounted) {
              setIsLoading(false);
            }
          });
      } else {
        setIsLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};