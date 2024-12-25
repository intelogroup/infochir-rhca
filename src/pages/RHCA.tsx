import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Globe, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ArticleList } from "@/components/rhca/ArticleList";
import { AdminPanel } from "@/components/rhca/admin/AdminPanel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RHCA = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error checking admin status:', adminError);
          toast.error("Erreur lors de la vérification des droits d'administrateur");
        }

        setIsAdmin(!!adminData);
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Erreur de session");
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Revue Haïtienne de Chirurgie et d'Anesthésiologie
              </h1>
              <p className="mt-2 text-gray-600 max-w-3xl">
                La RHCA est une revue scientifique dédiée à l'avancement des
                connaissances en chirurgie et anesthésiologie, avec un focus
                particulier sur les défis et innovations dans le contexte haïtien.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            {isAdmin ? <AdminPanel /> : <ArticleList />}
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">À propos de la RHCA</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Publication Scientifique</h3>
                    <p className="text-sm text-gray-600">
                      Articles évalués par des pairs, cas cliniques et revues de
                      littérature
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Collaboration</h3>
                    <p className="text-sm text-gray-600">
                      Espace d'échange entre professionnels de santé
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Portée Internationale</h3>
                    <p className="text-sm text-gray-600">
                      Visibilité mondiale de la recherche médicale haïtienne
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Excellence</h3>
                    <p className="text-sm text-gray-600">
                      Promotion des meilleures pratiques médicales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHCA;