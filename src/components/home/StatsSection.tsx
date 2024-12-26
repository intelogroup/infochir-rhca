import { Users, BookOpen, Award, Star, Globe2, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { motion } from "framer-motion";

const stats = [
  { 
    icon: Users,
    title: "Utilisateurs actifs",
    value: "2,000+",
    iconClassName: "text-secondary fill-secondary"
  },
  { 
    icon: Globe2,
    title: "Pays représentés",
    value: "25+",
    iconClassName: "text-secondary fill-secondary"
  },
  { 
    icon: BookOpen,
    title: "Articles publiés",
    value: "500+",
    iconClassName: "text-secondary fill-secondary"
  },
  { 
    icon: TrendingUp,
    title: "Citations",
    value: "1,500+",
    iconClassName: "text-secondary fill-secondary"
  },
  { 
    icon: Award,
    title: "Prix reçus",
    value: "12+",
    iconClassName: "text-secondary fill-secondary"
  },
  { 
    icon: Star,
    title: "Satisfaction",
    value: "4.8/5",
    iconClassName: "text-secondary fill-secondary"
  }
];

export const StatsSection = () => {
  return (
    <section className="relative my-8 bg-white">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-secondary/5 p-4 rounded-xl shadow-sm border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-md"
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};