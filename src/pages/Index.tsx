import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { BookOpen, Database, Newspaper } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Index = () => {
  const [email, setEmail] = useState("");
  const [showAtlasDialog, setShowAtlasDialog] = useState(false);
  const [showIGMDialog, setShowIGMDialog] = useState(false);

  const products = [
    {
      title: "RHCA",
      description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie - Publiez vos articles scientifiques.",
      icon: BookOpen,
      href: "/rhca",
      logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png",
      bgImage: "/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png"
    },
    {
      title: "Index Medicus",
      description: "Accédez à des références médicales organisées par auteur et thème.",
      icon: Database,
      href: "#index-medicus",
      logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
    },
    {
      title: "Atlas ADC",
      description: "Explorez une base visuelle unique pour faciliter vos diagnostics.",
      icon: BookOpen,
      onClick: () => setShowAtlasDialog(true),
      logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png",
      href: "#atlas"
    },
    {
      title: "IGM",
      description: "Restez informé des dernières nouvelles et évolutions du domaine médical.",
      icon: Newspaper,
      onClick: () => setShowIGMDialog(true),
      logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png",
      href: "#igm"
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    toast.success("Merci de votre inscription à notre newsletter!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      
      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos ressources complètes pour la communauté médicale
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir les dernières publications et actualités
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              S'abonner
            </Button>
          </form>
        </div>
      </section>

      {/* Atlas Dialog */}
      <Dialog open={showAtlasDialog} onOpenChange={setShowAtlasDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Atlas ADC</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src="/lovable-uploads/c2887190-a8a5-4f96-9268-79835f4cd5b6.png"
              alt="Atlas ADC Preview"
              className="w-full rounded-lg shadow-lg"
            />
            <p className="mt-4 text-gray-600">
              Explorez notre base visuelle complète pour faciliter vos diagnostics et améliorer votre pratique médicale.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* IGM Dialog */}
      <Dialog open={showIGMDialog} onOpenChange={setShowIGMDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>IGM - Informations Générales Médicales</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src="/lovable-uploads/a7d3e225-a6f7-4502-b77f-a4ef7c51b191.png"
              alt="IGM Preview"
              className="w-full rounded-lg shadow-lg mb-6"
            />
            <div className="space-y-4">
              <p className="text-gray-600">
                IGM (Informations Générales Médicales) est votre source d'actualités médicales en Haïti. Notre plateforme offre :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Des actualités médicales quotidiennes</li>
                <li>Des analyses approfondies des tendances en santé</li>
                <li>Des rapports sur les avancées médicales</li>
                <li>Des informations sur les conférences et événements médicaux</li>
              </ul>
              <p className="text-gray-600">
                Restez informé des dernières actualités et évolutions du domaine médical en Haïti et dans le monde.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Index;