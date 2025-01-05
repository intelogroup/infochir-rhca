import { MainLayout } from "@/components/layouts/MainLayout";

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">À propos d'INFOCHIR/RHCA</h1>
          <p className="text-lg text-gray-700">
            INFOCHIR/RHCA est une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie.
            Notre mission est de faciliter le partage des connaissances médicales et de promouvoir la recherche scientifique.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Notre Mission</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Partage des Connaissances</h3>
              <p className="text-gray-600">
                Faciliter l'accès et le partage des connaissances médicales entre professionnels de santé.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                Promouvoir l'innovation et la recherche en chirurgie et anesthésiologie.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Formation Continue</h3>
              <p className="text-gray-600">
                Soutenir la formation continue des professionnels de santé.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Nos Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Publications Scientifiques</h3>
              <p className="text-gray-600">
                Publication d'articles scientifiques revus par des pairs dans le domaine de la chirurgie et de l'anesthésiologie.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Base de Données Médicale</h3>
              <p className="text-gray-600">
                Accès à une vaste collection de ressources médicales et de références bibliographiques.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;