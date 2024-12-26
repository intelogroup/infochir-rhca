import { motion } from "framer-motion";

const sponsors = [
  {
    name: "UMREP",
    logo: "/lovable-uploads/bb937ab1-3f45-4a51-8791-420d086ea071.png",
  },
  {
    name: "Agences Vallieres",
    logo: "/lovable-uploads/76bfab45-eb57-49c4-b4c8-5a8c9c268c0e.png",
  },
  {
    name: "ASHAC",
    logo: "/lovable-uploads/4c3beb92-b2bf-4e90-b874-757e8c1ed4e7.png",
  },
  {
    name: "Laboratoires Farmatrix",
    logo: "/lovable-uploads/3b53ffd7-7e51-4197-b951-45b3d996c5d9.png",
  },
  {
    name: "HMS Medical Supplies",
    logo: "/lovable-uploads/cc57d2a1-5f69-4a2a-80ff-5b844065cefe.png",
  },
];

export const SponsorsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4"
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
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="relative aspect-[3/2] w-full flex items-center justify-center p-6">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="w-full h-full object-contain mix-blend-multiply filter transition-all duration-300"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-300" />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-sm text-gray-600 font-medium">{sponsor.name}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};