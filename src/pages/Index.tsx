import { Book, Database, Image, Newspaper } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

const Index = () => {
  const products = [
    {
      title: "RHCA",
      description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie - Publiez vos articles scientifiques.",
      icon: Book,
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
      icon: Image,
      href: "#atlas",
      logo: "/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
    },
    {
      title: "IGM",
      description: "Restez informé des dernières nouvelles et évolutions du domaine médical.",
      icon: Newspaper,
      href: "#igm",
      logo: "/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight">
            Votre espace scientifique en ligne
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <button className="bg-white text-primary hover:bg-white/90 px-10 py-4 rounded-full text-lg font-medium transition-all animate-fade-up shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Soumettre votre article
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative -mt-20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-12 sm:p-16">
            <div className="relative text-center">
              <h2 className="text-4xl font-bold text-white mb-8">
                Rejoignez notre communauté scientifique
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
                Participez au développement de la médecine en Haïti en partageant vos connaissances et expériences.
              </p>
              <button className="bg-white text-primary hover:bg-white/90 px-10 py-4 rounded-full text-lg font-medium transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Créer un compte
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;