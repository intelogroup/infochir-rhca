import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error checking user:", error);
          return;
        }
        if (user) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        toast.success("Successfully signed in!");
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        toast.success("Successfully signed out!");
        navigate("/auth");
      } else if (event === "USER_UPDATED") {
        toast.success("Profile updated successfully!");
      } else if (event === "PASSWORD_RECOVERY") {
        toast.info("Password recovery email sent!");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
            alt="Info Chir Logo"
            className="h-12 w-auto mx-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to InfoChir
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>
        <div className="mt-8">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#0EA5E9',
                    brandAccent: '#0284C7',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: 'Already have an account? Sign in',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: 'Don\'t have an account? Sign up',
                },
                magic_link: {
                  button_label: 'Send magic link',
                  loading_button_label: 'Sending magic link...',
                },
                forgotten_password: {
                  link_text: 'Forgot password?',
                  button_label: 'Send reset password instructions',
                  loading_button_label: 'Please wait...',
                  confirmation_text: 'Check your email for the password reset link',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;