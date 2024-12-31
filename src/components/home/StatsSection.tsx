import { stats } from "./stats/StatsData";
import { StatCard } from "./stats/StatCard";

export const StatsSection = () => {
  return (
    <section className="relative my-8 bg-gradient-to-br from-white via-gray-50/50 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};