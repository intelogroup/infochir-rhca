import { Book, Database, Image, Newspaper, Users, Globe2, BookOpen, TrendingUp, Mail, ArrowRight, Quote } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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

  const stats = [
    { label: "Utilisateurs actifs", value: "2,000+", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Pays représentés", value: "25+", icon: Globe2, color: "from-green-500 to-green-600" },
    { label: "Articles publiés", value: "500+", icon: BookOpen, color: "from-purple-500 to-purple-600" },
    { label: "Citations", value: "1,500+", icon: TrendingUp, color: "from-orange-500 to-orange-600" },
  ];

  const featuredArticles = [
    {
      title: "Innovations en Chirurgie Laparoscopique",
      author: "Dr. Marie Laurent",
      date: "2024-03-15",
      category: "Chirurgie",
      image: "/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png"
    },
    {
      title: "Anesthésie en Pédiatrie",
      author: "Dr. Jean Baptiste",
      date: "2024-03-10",
      category: "Anesthésiologie",
      image: "/lovable-uploads/e8fe216b-7e19-48a9-9251-22c63959d38c.png"
    },
  ];

  const testimonials = [
    {
      quote: "InfoChir a révolutionné ma façon d'accéder aux ressources médicales. Une plateforme indispensable.",
      author: "Dr. Marie Claire",
      title: "Chirurgienne, Hôpital Universitaire de Port-au-Prince"
    },
    {
      quote: "La qualité des articles et la facilité d'accès font d'InfoChir un outil précieux pour la communauté médicale haïtienne.",
      author: "Dr. Jean-Paul Robert",
      title: "Professeur de Chirurgie, Université d'État d'Haïti"
    },
    {
      quote: "Une ressource inestimable pour rester à jour avec les dernières avancées en chirurgie.",
      author: "Dr. Sophie Martin",
      title: "Anesthésiste, Clinique Saint-François"
    }
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[url('/lovable-uploads/3686281a-0f1a-46e8-a03f-c56d49e3d791.png')] bg-cover bg-center opacity-10" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 animate-fade-up tracking-tight">
            Votre espace scientifique en ligne
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed">
            La plateforme de référence pour les professionnels de santé en Haïti
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-full text-lg font-medium transition-all animate-fade-up shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Soumettre votre article
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium transition-all animate-fade-up">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-3xl mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      {/* Testimonials Carousel */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ce que disent nos utilisateurs</h2>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex flex-col items-center text-center space-y-6 animate-fade-up">
                <Quote className="w-12 h-12 text-primary/20 mb-4" />
                <p className="text-xl text-gray-700 italic leading-relaxed">
                  {testimonials[currentTestimonial].quote}
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].author}</p>
                  <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].title}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    currentTestimonial === index ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles with improved design */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Articles à la une</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les dernières publications de notre communauté médicale
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map((article, index) => (
              <Card key={article.title} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-light transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-white/90">Par {article.author}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="group">
              Voir tous les articles
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 opacity-80" />
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

      <Footer />
    </div>
  );
};

export default Index;
