import { motion } from "framer-motion";

export const SubmissionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12 space-y-4"
    >
      <p className="type-eyebrow">Soumission</p>
      <h1 className="type-display text-foreground">Soumettre un article</h1>
      <div className="rule-gold" />
      <p className="type-lead max-w-2xl">
        Veuillez remplir ce formulaire pour soumettre votre article à la RHCA, à l'Atlas ou à l'IGM.
      </p>
    </motion.div>
  );
};
