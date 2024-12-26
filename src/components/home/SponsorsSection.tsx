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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ils nous font confiance et nous soutiennent
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full max-w-[200px] p-4 group"
            >
              <div className="relative aspect-[3/2] w-full">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};