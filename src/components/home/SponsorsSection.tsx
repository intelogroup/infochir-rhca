import { motion } from "framer-motion";
import { sponsors } from "./sponsors/SponsorsData";
import { SponsorCard } from "./sponsors/SponsorCard";

export const SponsorsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Updated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF] via-[#41b06e] to-[#41b06e] opacity-5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#1E40AF] via-[#41b06e] to-[#41b06e] bg-clip-text text-transparent mb-4"
          >
            Nos Partenaires
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Ils nous font confiance et nous soutiennent dans notre mission
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 items-center">
          {sponsors.map((sponsor, index) => (
            <SponsorCard key={sponsor.name} sponsor={sponsor} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};