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
    <section className="relative mt-20 mb-16">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 scale-[0.6] origin-top">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow animate-fade-up rounded-3xl w-[500px]" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-3xl">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                  <div className="text-sm text-primary mt-2">{stat.detail}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};