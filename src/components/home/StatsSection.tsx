import { BookOpen, User, Tag, Calendar } from "lucide-react";
import { StatsCard } from "@/components/adc/StatsCard";

export const StatsSection = () => {
  return (
    <section className="relative -mt-10 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: "Publications Totales", value: "2500+" },
            { icon: User, title: "Auteurs", value: "500+" },
            { icon: Tag, title: "Catégories", value: "50+" },
            { icon: Calendar, title: "Années d'Archives", value: "10+" }
          ].map((stat, index) => (
            <div 
              key={stat.title}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};