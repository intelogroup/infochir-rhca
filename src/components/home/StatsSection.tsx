import { Card } from "@/components/ui/card";
import { Users, Globe2, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { label: "Utilisateurs actifs", value: "2,000+", icon: Users },
  { label: "Pays représentés", value: "25+", icon: Globe2 },
  { label: "Articles publiés", value: "500+", icon: BookOpen },
  { label: "Citations", value: "1,500+", icon: TrendingUp },
];

export const StatsSection = () => {
  return (
    <section className="relative -mt-10 mb-16">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-4 scale-[0.5] origin-top">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-4 bg-white shadow-lg hover:shadow-xl transition-shadow animate-fade-up rounded-3xl w-[400px]" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-3xl">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};