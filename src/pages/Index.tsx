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

const products = [
  {
    title: "RHCA",
    description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie - Publiez vos articles scientifiques.",
    icon: BookOpen,
    href: "/rhca",
    logo: "/lovable-uploads/f65134f5-3929-4504-9567-104510b21f5d.png"
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

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!email) {
        toast.error("Veuillez entrer une adresse email");
        return;
      }

      if (!email.includes('@')) {
        toast.error("Veuillez entrer une adresse email valide");
        return;
      }

      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Merci de votre inscription à notre newsletter!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-secondary">
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
            disabled={isSubmitting}
          />
          <Button 
            variant="secondary" 
            type="submit" 
            className="whitespace-nowrap bg-white text-primary hover:bg-white/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscription..." : "S'abonner"}
          </Button>
        </form>
      </div>
    </section>
  );
};

const ProductsGrid = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Produits</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos ressources complètes pour la communauté médicale
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.title} 
              className="animate-fade-up" 
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                try {
                  navigate(product.href);
                } catch (error) {
                  console.error("Navigation error:", error);
                  toast.error("Une erreur est survenue lors de la navigation");
                }
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ProductsGrid />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;