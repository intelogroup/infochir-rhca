import { motion } from "framer-motion";

const items = [
  {
    title: "Notre mission",
    body:
      "Assurer la qualité scientifique et la pertinence des articles publiés dans l'Info Gazette Médicale.",
  },
  {
    title: "Notre engagement",
    body:
      "Maintenir les plus hauts standards de rigueur scientifique et d'éthique dans la publication médicale.",
  },
  {
    title: "Notre vision",
    body:
      "Contribuer à l'avancement des connaissances médicales en Haïti et promouvoir l'excellence en recherche.",
  },
];

export const EditorialMission = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 }}
    className="mb-16 grid gap-10 md:grid-cols-3"
  >
    {items.map((item) => (
      <div key={item.title} className="space-y-4">
        <div className="rule-gold" />
        <h2 className="type-h2 text-foreground">{item.title}</h2>
        <p className="text-base leading-relaxed text-muted-foreground">{item.body}</p>
      </div>
    ))}
  </motion.div>
);
