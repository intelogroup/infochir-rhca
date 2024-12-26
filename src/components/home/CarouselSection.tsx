import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Calendar, Newspaper, Users, GraduationCap, BookOpen } from "lucide-react";

const highlights = [
  {
    title: "Dernières Actualités",
    description: "Découvrez les dernières actualités et mises à jour d'InfoChir",
    icon: Newspaper,
    type: "news",
  },
  {
    title: "Message des Auteurs",
    description: "Un message spécial de nos contributeurs dévoués",
    icon: Users,
    type: "authors",
  },
  {
    title: "Articles Récents",
    description: "Les derniers articles publiés sur notre plateforme",
    icon: BookOpen,
    type: "articles",
  },
  {
    title: "Événements Scientifiques",
    description: "Calendrier des prochains événements scientifiques",
    icon: Calendar,
    type: "events",
  },
  {
    title: "Formations à Venir",
    description: "Ateliers et formations professionnelles programmés",
    icon: GraduationCap,
    type: "workshops",
  },
];

export const CarouselSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            À la Une
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières actualités et événements
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {highlights.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};