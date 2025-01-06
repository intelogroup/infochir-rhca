import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Users, Globe } from "lucide-react";

const Opportunities = () => {
  const opportunities = [
    {
      title: "Postes Médicaux",
      description: "Explorez les opportunités de carrière dans nos établissements partenaires.",
      icon: Briefcase,
      categories: ["Chirurgie", "Anesthésie", "Médecine générale"]
    },
    {
      title: "Programmes de Formation",
      description: "Découvrez nos programmes de formation continue et de spécialisation.",
      icon: GraduationCap,
      categories: ["Résidence", "Fellowship", "Formations spécialisées"]
    },
    {
      title: "Collaborations",
      description: "Participez à des projets de recherche et des collaborations internationales.",
      icon: Users,
      categories: ["Recherche", "Enseignement", "Projets cliniques"]
    },
    {
      title: "Missions Humanitaires",
      description: "Engagez-vous dans des missions médicales humanitaires à travers le monde.",
      icon: Globe,
      categories: ["Missions d'urgence", "Projets de développement", "Support médical"]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 pt-[50px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Opportunités Professionnelles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les opportunités de carrière, de formation et de collaboration dans le domaine médical.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <opportunity.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {opportunity.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {opportunity.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      En savoir plus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Opportunities;