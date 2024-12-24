import { Book, Database, Image, Newspaper } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";

const Index = () => {
  const products = [
    {
      title: "RHCA",
      description: "Revue Haïtienne de Chirurgie et d'Anesthésiologie - Publiez vos articles scientifiques.",
      icon: Book,
      href: "#rhca",
      logo: "/lovable-uploads/e8fe216b-7e19-48a9-9251-22c63959d38c.png"
    },
    {
      title: "Index Medicus",
      description: "Accédez à des références médicales organisées par auteur et thème.",
      icon: Database,
      href: "#index-medicus",
      logo: "/lovable-uploads/5d3116e3-d5c7-4fb3-a6ae-8ddf2d710f55.png"
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
    <div className="min-h-screen bg-muted">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-fade-up">
            Votre espace scientifique en ligne
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-up">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors animate-fade-up">
            Commencer
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Nos Ressources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Rejoignez notre communauté scientifique
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Participez au développement de la médecine en Haïti en partageant vos connaissances et expériences.
          </p>
          <button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors">
            Créer un compte
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;