import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { MedicalCaseGrid } from "@/components/MedicalCaseGrid";

const IGM = () => {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
              alt="IGM Logo"
              className="h-24 w-24 mx-auto mb-6 animate-fade-in"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
              Info Gynéco Médicale
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ressources et informations en gynécologie médicale pour les professionnels de santé
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <MedicalCaseGrid />
          </div>
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default IGM;