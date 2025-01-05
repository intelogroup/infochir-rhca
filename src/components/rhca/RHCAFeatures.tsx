import { BookOpen, Users, Globe, Award } from "lucide-react";

export const RHCAFeatures = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Publications Scientifiques",
      description: "Articles de recherche, études de cas et revues systématiques en chirurgie et anesthésiologie."
    },
    {
      icon: Users,
      title: "Communauté Médicale",
      description: "Échange d'expertise entre professionnels de santé haïtiens et internationaux."
    },
    {
      icon: Globe,
      title: "Portée Internationale",
      description: "Diffusion des avancées médicales haïtiennes à l'échelle mondiale."
    },
    {
      icon: Award,
      title: "Excellence Académique",
      description: "Promotion de la rigueur scientifique et de l'innovation en médecine."
    }
  ];

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-card hover:bg-accent/5 transition-colors duration-300"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};