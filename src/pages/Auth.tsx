import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Only show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Don't render anything if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  // Render auth form for non-authenticated users
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
            alt="Logo"
            className="mx-auto h-16 w-16 object-contain"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome to INFOCHIR
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access the platform
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
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
                container: 'space-y-4',
                button: 'w-full px-4 py-2.5 rounded-lg font-medium',
                input: 'rounded-lg border-gray-300',
                label: 'text-sm font-medium text-gray-700',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;