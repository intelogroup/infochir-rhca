import { Card } from "@/components/ui/card";
import { Users, Globe2, BookOpen, TrendingUp, Award, Star } from "lucide-react";

const stats = [
  { 
    label: "Utilisateurs actifs", 
    value: "2,000+", 
    icon: Users,
    detail: "Croissance mensuelle de 15%"
  },
  { 
    label: "Pays représentés", 
    value: "25+", 
    icon: Globe2,
    detail: "Sur 4 continents"
  },
  { 
    label: "Articles publiés", 
    value: "500+", 
    icon: BookOpen,
    detail: "Publications mensuelles"
  },
  { 
    label: "Citations", 
    value: "1,500+", 
    icon: TrendingUp,
    detail: "Impact factor moyen de 3.2"
  },
  { 
    label: "Prix reçus", 
    value: "12+", 
    icon: Award,
    detail: "Reconnaissances internationales"
  },
  { 
    label: "Satisfaction", 
    value: "4.8/5", 
    icon: Star,
    detail: "Basé sur 1000+ avis"
  }
];

export const StatsSection = () => {
  return (
    <section className="relative mt-12 mb-8">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-4 bg-white shadow hover:shadow-md transition-shadow animate-fade-up rounded-xl" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-xs text-primary mt-1">{stat.detail}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};