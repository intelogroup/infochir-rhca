import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { IssuesGrid } from "@/components/IssuesGrid";

const RHCA = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/990cb3a8-bdd0-46d9-8fe7-b258ccd9c691.png"
              alt="RHCA Logo"
              className="h-24 w-24 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Revue Haïtienne de Chirurgie et d'Anesthésiologie
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les dernières avancées en chirurgie et anesthésiologie
            </p>
          </div>
          <IssuesGrid />
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default RHCA;