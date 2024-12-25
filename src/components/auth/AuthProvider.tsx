import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        if (user) {
          setUser(user);
          // Check admin status
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (adminError && adminError.code !== 'PGRST116') {
            console.error("Error checking admin status:", adminError);
          }

          setIsAdmin(!!adminData);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError(err instanceof Error ? err.message : "Authentication error occurred");
        toast.error("Authentication error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          // Check admin status
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (adminError && adminError.code !== 'PGRST116') {
            console.error("Error checking admin status:", adminError);
          }

          setIsAdmin(!!adminData);
        }
        toast.success("Successfully signed in!");
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        toast.info("Signed out");
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};