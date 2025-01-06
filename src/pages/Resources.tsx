import { MainLayout } from "@/components/layouts/MainLayout";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { motion } from "framer-motion";
import { BookOpen, FileText, Book, List } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      title: "Publications Scientifiques",
      description: "Accédez à notre collection d'articles scientifiques, de recherches et de publications médicales.",
      icon: BookOpen,
      href: "/resources/publications"
    },
    {
      title: "Documents Cliniques",
      description: "Consultez nos guides cliniques, protocoles et documents de référence pour la pratique médicale.",
      icon: FileText,
      href: "/resources/clinical-documents"
    },
    {
      title: "Bibliothèque Médicale",
      description: "Explorez notre bibliothèque numérique de ressources médicales et chirurgicales.",
      icon: Book,
      href: "/resources/library"
    },
    {
      title: "Opportunités Professionnelles",
      description: "Découvrez les opportunités de carrière, stages et collaborations dans le domaine médical.",
      icon: List,
      href: "/opportunities"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ressources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez notre collection de ressources médicales, publications scientifiques et opportunités professionnelles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Resources;