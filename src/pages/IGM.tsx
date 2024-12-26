import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { IndexMedicusGrid } from "@/components/IndexMedicusGrid";

const IGM = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Info Gynéco Médicale</h1>
          <p className="text-lg text-gray-600">
            Explorez notre collection d'articles en gynécologie et médecine.
          </p>
        </div>
        <IndexMedicusGrid />
      </main>
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default IGM;