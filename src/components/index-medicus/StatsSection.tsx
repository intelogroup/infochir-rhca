import { BookOpen, User, Tag, Calendar } from "lucide-react";
import { StatsCard } from "@/components/adc/StatsCard";

export const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <StatsCard 
        icon={BookOpen} 
        title="Publications Totales" 
        value="2500+" 
      />
      <StatsCard 
        icon={User} 
        title="Auteurs" 
        value="500+" 
      />
      <StatsCard 
        icon={Tag} 
        title="Catégories" 
        value="50+" 
      />
      <StatsCard 
        icon={Calendar} 
        title="Années d'Archives" 
        value="10+" 
      />
    </div>
  );
};