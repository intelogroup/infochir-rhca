import { BookOpen, Users, Search, Database } from "lucide-react";
import { StatsCard } from "./StatsCard";

export const StatsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
    <StatsCard icon={BookOpen} title="Cas Documentés" value="1000+" />
    <StatsCard icon={Users} title="Utilisateurs Actifs" value="500+" />
    <StatsCard icon={Search} title="Spécialités" value="25+" />
    <StatsCard icon={Database} title="Images Archivées" value="5000+" />
  </div>
);