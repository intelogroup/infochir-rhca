import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError, User, AuthChangeEvent } from "@supabase/supabase-js";

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

  useEffect(() => {
    const checkAdminStatus = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("is_super_admin")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setIsAdmin(!!data?.is_super_admin);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setError(err instanceof Error ? err : new Error("Failed to check admin status"));
      }
    };

    const handleAuthChange = async (event: AuthChangeEvent, session: any) => {
      setIsLoading(true);
      try {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            await checkAdminStatus(currentUser.id);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error("Auth change error:", err);
        setError(err instanceof Error ? err : new Error("Authentication error"));
      } finally {
        setIsLoading(false);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
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