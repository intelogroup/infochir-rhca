import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Users, Globe } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SEO } from "@/components/seo/SEO";

const opportunities = [
  {
    title: "Postes médicaux",
    description: "Explorez les opportunités de carrière dans nos établissements partenaires.",
    icon: Briefcase,
    categories: ["Chirurgie", "Anesthésie", "Médecine générale"],
  },
  {
    title: "Programmes de formation",
    description: "Découvrez nos programmes de formation continue et de spécialisation.",
    icon: GraduationCap,
    categories: ["Résidence", "Fellowship", "Formations spécialisées"],
  },
  {
    title: "Collaborations",
    description: "Participez à des projets de recherche et des collaborations internationales.",
    icon: Users,
    categories: ["Recherche", "Enseignement", "Projets cliniques"],
  },
  {
    title: "Missions humanitaires",
    description: "Engagez-vous dans des missions médicales humanitaires à travers le monde.",
    icon: Globe,
    categories: ["Missions d'urgence", "Projets de développement", "Support médical"],
  },
];

const Opportunities = () => {
  return (
    <MainLayout>
      <SEO
        title="Opportunités et bourses | Info CHIR"
        description="Opportunités de formation, bourses, congrès et appels à communication pour les professionnels de santé en Haïti."
        path="/opportunities"
      />
      <PageHeader
        backLink="/"
        align="left"
        variant="brand"
        title="Opportunités professionnelles"
        description="Découvrez les opportunités de carrière, de formation et de collaboration dans le domaine médical."
      />

      <section className="section">
        <div className="container-content">
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-card p-8"
              >
                <opportunity.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h2 className="type-h2 mt-5 text-foreground">{opportunity.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {opportunity.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {opportunity.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-sm border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Opportunities;
