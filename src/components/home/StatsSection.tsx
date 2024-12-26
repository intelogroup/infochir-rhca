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
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between gap-8 scale-[0.6] origin-top">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-up rounded-3xl w-[500px] group hover:-translate-y-1" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-3xl bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    {stat.value}
                  </div>
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