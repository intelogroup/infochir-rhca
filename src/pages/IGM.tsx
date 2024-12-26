import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { MedicalCaseGrid } from "@/components/MedicalCaseGrid";

const IGM = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Info Gynéco Médicale
            </h1>
            <p className="text-lg text-gray-600">
              Ressources et informations en gynécologie médicale
            </p>
          </div>
          <MedicalCaseGrid />
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default IGM;