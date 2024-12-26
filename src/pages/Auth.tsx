import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          const returnTo = location.state?.from?.pathname || "/";
          navigate(returnTo, { replace: true });
        }
      } catch (err) {
        console.error("Auth page: Session check error:", err);
        const error = err instanceof Error ? err : new Error("Failed to check authentication status");
        toast.error(error.message);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success(`Welcome ${session.user.email}`);
        const returnTo = location.state?.from?.pathname || "/";
        navigate(returnTo, { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
            alt="Logo"
            className="h-12 w-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome to INFOCHIR</h1>
          <p className="text-gray-600 mt-2">Please sign in to continue</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 rounded-lg',
                input: 'rounded-lg',
                message: 'text-sm text-red-600',
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}${location.pathname}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;