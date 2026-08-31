import { MainLayout } from "@/components/layouts/MainLayout";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/page-header";
import { SEO } from "@/components/seo/SEO";

const pillars = [
  {
    title: "Notre mission",
    body:
      "Créer et publier des revues scientifiques pour documenter et partager les connaissances médicales en chirurgie et anesthésiologie.",
  },
  {
    title: "Nos objectifs",
    body:
      "Offrir une plateforme d'expression pour les professionnels de la santé et contribuer à l'avancement de la médecine en Haïti.",
  },
  {
    title: "Notre communauté",
    body:
      "Rassembler éducateurs, praticiens et chercheurs pour créer une communauté médicale forte et collaborative.",
  },
];

const publications = [
  {
    name: "RHCA",
    subtitle: "Publication trimestrielle",
    body: "Articles médicaux, diaporamas, dossiers et informations scientifiques.",
  },
  {
    name: "IGM",
    subtitle: "L'Info Gazette Médicale",
    body: "Publication mensuelle lancée en décembre 2020.",
  },
];

const About = () => {
  return (
    <MainLayout>
      <SEO
        title="À propos d'Info CHIR | Mission et publications"
        description="Découvrez Info CHIR : notre mission, nos objectifs et nos publications scientifiques (RHCA, IGM) au service de la santé en Haïti."
        path="/about"
      />
      <div className="min-h-screen bg-background">
        <PageHeader
          backLink="/"
          align="left"
          variant="brand"
          title="À propos d'INFOCHIR/RHCA"
          description="En 2011, des médecins visionnaires se sont réunis pour créer INFOCHIR/RHCA, une organisation dédiée à la promotion de la littérature médicale haïtienne, à la recherche et au culte des aînés."
        />

        <section className="section">
          <div className="container-content">
            <div className="grid gap-10 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <div className="rule-gold" />
                  <h2 className="type-h2 text-foreground">{pillar.title}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground">{pillar.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section border-t border-border">
          <div className="container-content">
            <div className="max-w-3xl space-y-5">
              <p className="type-eyebrow">La revue</p>
              <h2 className="type-h1 text-foreground">
                La Revue Haïtienne de Chirurgie et d'Anesthésiologie
              </h2>
              <p className="type-lead">
                Fondée en 2011, la RHCA est une publication trimestrielle qui documente et partage les
                expériences, recherches et innovations en chirurgie et en anesthésiologie en Haïti.
              </p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
              {publications.map((pub) => (
                <div key={pub.name} className="bg-card p-8">
                  <h3 className="type-h3 text-foreground">{pub.name}</h3>
                  <p className="mt-2 text-sm font-medium text-foreground/70">{pub.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pub.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FoundersSection />
        <SponsorsSection />
      </div>
    </MainLayout>
  );
};

export default About;
