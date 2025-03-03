
import { motion } from "framer-motion";
import { Users, BookOpen, Heart, Building, Coffee, BookText, MessageSquare, FileText } from "lucide-react";
import { DirectiveSection } from "@/components/directives/DirectiveSection";
import { Card } from "@/components/ui/card";

interface EditorialMember {
  name: string;
  role?: string;
}

interface EditorialSection {
  title: string;
  coordinator?: string;
  members: EditorialMember[];
  icon: React.ReactNode;
}

export const IGMEditorialCommittee = () => {
  const sections: EditorialSection[] = [
    {
      title: "Rédaction et de l'Éditorial",
      coordinator: "Michel Dodard",
      members: [
        { name: "Maxime Coles", role: "conseiller" },
      ],
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Lu pour vous",
      coordinator: "Michel Dodard",
      members: [
        { name: "Ernst Jean Baptiste", role: "membre" },
        { name: "Henry Jean-Baptiste", role: "membre" },
      ],
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    {
      title: "Santé Publique",
      coordinator: "Pavel Desrosiers",
      members: [
        { name: "Franck Généus", role: "membre" },
        { name: "Guirlaine Raymond", role: "membre" },
        { name: "Chesnel Norcéide", role: "membre" },
        { name: "Mario Laroche", role: "membre" },
      ],
      icon: <Heart className="h-6 w-6 text-primary" />
    },
    {
      title: "Actualités Intra Hospitalières",
      coordinator: "Christophe Millien",
      members: [
        { name: "Wilfine Dupont", role: "membre" },
        { name: "Pierre-Marie Woolley", role: "membre" },
        { name: "Vanessa Jaelle Dor", role: "membre" },
      ],
      icon: <Building className="h-6 w-6 text-primary" />
    },
    {
      title: "Académie et Professions",
      coordinator: "Edith C. Georges",
      members: [
        { name: "Marlyn Lestage-Laforest", role: "membre" },
        { name: "Carine Réveil Jean-Baptiste", role: "membre" },
      ],
      icon: <BookText className="h-6 w-6 text-primary" />
    },
    {
      title: "Informations Socio Culturelles",
      coordinator: "Jessy Colimon Adrien",
      members: [
        { name: "Judith Jean-Baptiste", role: "adjointe" },
        { name: "Wisly Joseph", role: "membre" },
        { name: "Claudine Hyppolite", role: "membre" },
        { name: "Nadège Charlot", role: "membre" },
      ],
      icon: <Coffee className="h-6 w-6 text-primary" />
    },
    {
      title: "Éthique",
      coordinator: "Gérald Lerebours",
      members: [],
      icon: <MessageSquare className="h-6 w-6 text-primary" />
    },
    {
      title: "Petites Annonces",
      coordinator: "Louis Franck Télémaque",
      members: [],
      icon: <FileText className="h-6 w-6 text-primary" />
    },
    {
      title: "Direction et Édition",
      members: [
        { name: "Jean Alouidor", role: "Éditeur en chef" },
        { name: "Eunice Dérivois", role: "Direction de lecture" },
        { name: "Jean Alouidor", role: "Conception et réalisation" },
      ],
      icon: <Users className="h-6 w-6 text-primary" />
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8 mb-12"
    >
      <DirectiveSection 
        title="Membres du Comité d'INFO GAZETTE MÉDICALE"
        icon={<Users className="h-8 w-8 text-secondary" />}
      >
        <p className="text-gray-600 mb-8">
          Le comité éditorial d'INFO GAZETTE MÉDICALE est composé d'experts médicaux qui contribuent 
          à la qualité et à la rigueur de nos publications dans différents domaines de spécialisation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {section.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-primary">{section.title}</h3>
                    {section.coordinator && (
                      <p className="text-sm text-secondary font-medium">
                        Coordonnateur: {section.coordinator}
                      </p>
                    )}
                  </div>
                </div>

                {section.members.length > 0 && (
                  <ul className="space-y-2 pl-10">
                    {section.members.map((member, memberIndex) => (
                      <li key={memberIndex} className="text-gray-700">
                        <span className="font-medium">{member.name}</span>
                        {member.role && <span className="text-gray-500 ml-2">({member.role})</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          ))}
        </div>
      </DirectiveSection>
    </motion.div>
  );
};
