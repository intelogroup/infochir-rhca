import { Users, BookOpen, Award, Star, Globe2, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { motion } from "framer-motion";

const stats = [
  { 
    icon: Users,
    title: "Utilisateurs actifs",
    value: "2,000+"
  },
  { 
    icon: Globe2,
    title: "Pays représentés",
    value: "25+"
  },
  { 
    icon: BookOpen,
    title: "Articles publiés",
    value: "500+"
  },
  { 
    icon: TrendingUp,
    title: "Citations",
    value: "1,500+"
  },
  { 
    icon: Award,
    title: "Prix reçus",
    value: "12+"
  },
  { 
    icon: Star,
    title: "Satisfaction",
    value: "4.8/5"
  }
];

export const StatsSection = () => {
  return (
    <section className="relative mt-12 mb-8 bg-secondary/5">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-secondary/20 hover:border-secondary/40 transition-colors"
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};