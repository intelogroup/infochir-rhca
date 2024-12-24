import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, Tag, ArrowRight } from "lucide-react";

const IGM = () => {
  const articles = [
    {
      title: "Avancées en chirurgie cardiaque minimalement invasive",
      date: "15 Mars 2024",
      category: "Chirurgie",
      summary: "Les dernières innovations en matière de chirurgie cardiaque permettent des interventions moins invasives avec des temps de récupération réduits."
    },
    {
      title: "L'impact de l'IA sur le diagnostic médical",
      date: "12 Mars 2024",
      category: "Technologies",
      summary: "Comment l'intelligence artificielle révolutionne le processus de diagnostic et améliore la précision des résultats."
    },
    {
      title: "Nouvelles approches dans le traitement du diabète",
      date: "10 Mars 2024",
      category: "Endocrinologie",
      summary: "Des recherches récentes ouvrent la voie à des traitements plus efficaces pour les patients diabétiques."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Info Gazette Médicale</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            L'actualité médicale et scientifique à portée de main
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                  <Tag className="w-4 h-4 ml-2" />
                  <span>{article.category}</span>
                </div>
                <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <Button variant="ghost" className="group">
                  Lire la suite
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-primary hover:bg-primary-light">
            Voir plus d'articles
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IGM;