import { Button } from "@/components/ui/button";
import { ArrowLeft, Newspaper, Globe, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

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

const IGM = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef")',
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
            src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
            alt="IGM Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Informations Générales Médicales
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Votre source d'actualités médicales en Haïti - Restez informé des dernières avancées et développements dans le domaine médical.
          </p>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard 
              icon={Newspaper} 
              title="Articles Publiés" 
              value="500+" 
            />
            <StatCard 
              icon={Users} 
              title="Lecteurs Actifs" 
              value="2000+" 
            />
            <StatCard 
              icon={Globe} 
              title="Couverture Pays" 
              value="15+" 
            />
            <StatCard 
              icon={TrendingUp} 
              title="Croissance Mensuelle" 
              value="12%" 
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notre Mission</h2>
            <p className="text-gray-600 mb-6">
              IGM est dédiée à fournir des informations médicales précises et actualisées à la communauté médicale haïtienne. Notre plateforme sert de pont entre les professionnels de santé et les dernières avancées médicales.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Actualités médicales quotidiennes</li>
                  <li>Analyses des tendances en santé</li>
                  <li>Rapports sur les avancées médicales</li>
                  <li>Couverture des événements médicaux</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Plus de 500 articles publiés</li>
                  <li>2000+ lecteurs actifs mensuels</li>
                  <li>Présence dans 15 pays</li>
                  <li>12% de croissance mensuelle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            {/* Latest News Grid - To be implemented */}
            <div className="grid gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">Dernières Actualités</h2>
                <p className="text-gray-600">
                  La section des dernières actualités sera bientôt disponible.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Subscribe section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Abonnez-vous
              </h2>
              <p className="text-gray-600 mb-6">
                Recevez nos dernières actualités et mises à jour directement dans votre boîte mail.
              </p>
              <Button className="w-full bg-primary hover:bg-primary-light">
                S'abonner maintenant
              </Button>
            </div>

            {/* Categories section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Catégories
              </h2>
              <ul className="space-y-3">
                <li className="text-gray-600">Recherche Médicale</li>
                <li className="text-gray-600">Santé Publique</li>
                <li className="text-gray-600">Innovations Médicales</li>
                <li className="text-gray-600">Formation Continue</li>
              </ul>
            </div>

            {/* Contact section */}
            <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-600 mb-6">
                Vous avez une actualité à partager ou une question ? Contactez notre équipe éditoriale.
              </p>
              <Button variant="outline" className="w-full">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IGM;