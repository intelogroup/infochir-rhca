import { stats } from "./stats/StatsData";
import { StatCard } from "./stats/StatCard";

export const StatsSection = () => {
  return (
    <section className="relative my-8 bg-white">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};