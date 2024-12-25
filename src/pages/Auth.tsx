import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Development helper to track auth state
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth State:', { user, isLoading });
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Development helper for auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth event:', event, 'Session:', session);
      }

      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Signed out');
      } else if (event === 'USER_UPDATED') {
        toast.success('User profile updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleAuthError = (error: Error) => {
    console.error('Auth error:', error);
    setAuthError(error.message);
    toast.error('Authentication error occurred');
  };

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
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-sm text-blue-600">
              Development Mode Active
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}
          
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
              },
            }}
            providers={[]}
            view="sign_in"
            redirectTo={window.location.origin}
          />
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">Development Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check console for detailed auth events</li>
                <li>Disable email verification in Supabase for faster testing</li>
                <li>Auth redirects to: {window.location.origin}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;