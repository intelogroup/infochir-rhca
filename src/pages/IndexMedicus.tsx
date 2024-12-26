import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/Footer";
import { IndexMedicusGrid } from "@/components/IndexMedicusGrid";

const IndexMedicus = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
              alt="Index Medicus Logo"
              className="h-24 w-24 mx-auto mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Index Médicus
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Base de données complète d'articles médicaux et de recherches scientifiques
            </p>
          </div>
          <IndexMedicusGrid />
        </div>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default IndexMedicus;