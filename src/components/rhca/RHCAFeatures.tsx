import { BookOpen, Users, Award } from "lucide-react";

export const RHCAFeatures = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Publication Scientifique",
      description: "Partagez vos recherches et découvertes avec la communauté médicale"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Collaboration",
      description: "Connectez-vous avec d'autres professionnels de la santé"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description: "Contribuez à l'amélioration des pratiques médicales"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-muted hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};