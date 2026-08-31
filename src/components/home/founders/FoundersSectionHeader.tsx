import { motion } from "framer-motion";

export const FoundersSectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12 space-y-4"
    >
      <p className="type-eyebrow">Depuis 2011</p>
      <h2 className="type-h1 text-foreground">Membres fondateurs</h2>
      <div className="rule-gold" />
      <p className="type-lead max-w-3xl">
        En 2011, ces médecins visionnaires se sont réunis pour créer Info CHIR, donnant naissance à une
        organisation dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
      </p>
    </motion.div>
  );
};
