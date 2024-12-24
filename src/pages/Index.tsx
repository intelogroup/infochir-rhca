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
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
      href: "/index-medicus",
      logo: "/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
    },
    {
      title: "Atlas ADC",
      description: "Explorez une base visuelle unique pour faciliter vos diagnostics.",
      icon: BookOpen,
      href: "/adc",
      logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
    },
    {
      title: "IGM",
      description: "Restez informé des dernières nouvelles et évolutions du domaine médical.",
      icon: Newspaper,
      href: "/igm",
      logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
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
            {products.map((product) => (
              <div 
                key={product.title} 
                className="animate-fade-up cursor-pointer" 
                style={{ animationDelay: '100ms' }}
                onClick={() => navigate(product.href)}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="w-12 h-12 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl font-bold mb-4 text-white">Restez informé</h2>
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
            <Button variant="secondary" type="submit" className="whitespace-nowrap">
              S'abonner
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;