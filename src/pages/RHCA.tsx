import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { IndexMedicusGrid } from "@/components/IndexMedicusGrid";

const RHCA = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Revue Haïtienne de Chirurgie et d'Anesthésiologie
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez les dernières avancées en chirurgie et anesthésiologie.
          </p>
        </div>
        <IndexMedicusGrid />
      </main>
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default RHCA;