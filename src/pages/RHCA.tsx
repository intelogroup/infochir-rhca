import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Globe, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { IssuesGrid } from "@/components/IssuesGrid";
import { AdminPanel } from "@/components/rhca/AdminPanel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-primary/5 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const RHCA = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Simplified admin check without Supabase
  useEffect(() => {
    // For development, you can set this to true to see admin features
    setIsAdmin(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581092795360-fd1ca04f0952")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.03'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
            alt="RHCA Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            La première revue scientifique dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
          </p>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard 
              icon={BookOpen} 
              title="Articles Publiés" 
              value="200+" 
            />
            <StatCard 
              icon={Users} 
              title="Contributeurs" 
              value="150+" 
            />
            <StatCard 
              icon={Globe} 
              title="Pays Lecteurs" 
              value="25+" 
            />
            <StatCard 
              icon={Award} 
              title="Années d'Excellence" 
              value="10+" 
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-600 mb-6">
              La RHCA est une publication scientifique biannuelle qui vise à promouvoir l'excellence en chirurgie et en anesthésiologie en Haïti. Notre mission est de fournir une plateforme pour partager les connaissances, les innovations et les meilleures pratiques dans le domaine médical.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Objectifs</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Promouvoir la recherche médicale locale</li>
                  <li>Faciliter le partage des connaissances</li>
                  <li>Améliorer les pratiques cliniques</li>
                  <li>Encourager la collaboration internationale</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Plus de 200 articles publiés</li>
                  <li>Collaboration avec 15 institutions</li>
                  <li>Lectorat dans 25 pays</li>
                  <li>Indexation dans des bases internationales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            {isAdmin ? (
              <AdminPanel />
            ) : (
              <IssuesGrid />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Submission section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Soumission d'articles
              </h2>
              <p className="text-gray-600 mb-6">
                Nous accueillons les articles originaux, les revues systématiques, les cas cliniques et les lettres à l'éditeur. Notre processus de révision par les pairs garantit la qualité et la pertinence de chaque publication.
              </p>
              <Button className="w-full bg-primary hover:bg-primary-light">
                Soumettre un manuscrit
              </Button>
            </div>

            {/* Instructions section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Instructions aux auteurs
              </h2>
              <p className="text-gray-600 mb-6">
                Consultez nos directives détaillées pour la préparation et la soumission de votre manuscrit. Nous fournissons des modèles et des conseils pour assurer une présentation optimale de vos travaux.
              </p>
              <Button variant="outline" className="w-full">
                Voir les directives
              </Button>
            </div>

            {/* Editorial board section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Comité éditorial
              </h2>
              <p className="text-gray-600 mb-6">
                Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, garantissant la qualité et la pertinence des publications.
              </p>
              <Button variant="outline" className="w-full">
                Découvrir l'équipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RHCA;
