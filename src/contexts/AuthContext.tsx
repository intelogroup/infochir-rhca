import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to check authentication status'));
          toast.error("Failed to check authentication status");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (mounted) {
        setUser(session?.user ?? null);
        setError(null);

        switch (event) {
          case "SIGNED_IN":
            toast.success(`Welcome ${session?.user.email}`);
            break;
          case "SIGNED_OUT":
            toast.info("Signed out");
            break;
          case "USER_UPDATED":
            toast.success("Profile updated");
            break;
          case "USER_DELETED":
            toast.info("Account deleted");
            break;
          case "PASSWORD_RECOVERY":
            toast.info("Password recovery email sent");
            break;
          default:
            break;
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};