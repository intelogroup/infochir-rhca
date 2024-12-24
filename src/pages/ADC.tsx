import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Search, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { DiagnosticGrid } from "@/components/DiagnosticGrid";

const StatCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
  <div className="bg-white/95 backdrop-blur-xs rounded-xl p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/5 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const ADC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.2'
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
            alt="Atlas ADC Logo"
            className="h-20 w-20 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Atlas de Diagnostic Clinique
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Une base de données visuelle complète pour faciliter le diagnostic clinique et améliorer la pratique médicale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <StatCard 
              icon={BookOpen} 
              title="Cas Documentés" 
              value="1000+" 
            />
            <StatCard 
              icon={Users} 
              title="Utilisateurs Actifs" 
              value="500+" 
            />
            <StatCard 
              icon={Search} 
              title="Spécialités" 
              value="25+" 
            />
            <StatCard 
              icon={Database} 
              title="Images Archivées" 
              value="5000+" 
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-6 gap-6 max-w-[90rem] mx-auto">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Cas Diagnostiques Récents</h2>
              <DiagnosticGrid />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recherche Avancée
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Utilisez notre moteur de recherche avancé pour trouver des cas spécifiques par pathologie, spécialité ou symptômes.
              </p>
              <Button className="w-full">
                Lancer une recherche
              </Button>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Spécialités
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">Radiologie</li>
                <li className="text-gray-600">Cardiologie</li>
                <li className="text-gray-600">Neurologie</li>
                <li className="text-gray-600">Orthopédie</li>
                <li className="text-gray-600">Pneumologie</li>
              </ul>
            </div>

            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contribution
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Partagez vos cas cliniques avec la communauté médicale et contribuez à l'enrichissement de notre base de données.
              </p>
              <Button variant="outline" className="w-full">
                Soumettre un cas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADC;