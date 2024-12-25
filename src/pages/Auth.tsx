import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("Error checking session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success(`Welcome ${session.user.email}`);
        navigate("/");
      } else if (event === 'SIGNED_OUT') {
        toast.info("Signed out");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            view="sign_in"
            redirectTo={window.location.origin}
            onError={(error) => {
              console.error("Auth error:", error);
              toast.error(error.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;