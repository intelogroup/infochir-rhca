import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ADC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-4xl font-bold text-primary">Atlas de Diagnostic Chirurgical</h1>
          <p className="text-lg text-gray-700">
            Explorez notre base de données visuelle de cas chirurgicaux pour améliorer votre pratique clinique.
          </p>
        </section>

        <section className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher un cas clinique..."
              className="pl-10 w-full"
            />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Cas Cliniques</h3>
            <p className="text-gray-600">
              Accédez à une collection de cas cliniques documentés avec images et descriptions détaillées.
            </p>
            <Button variant="outline" className="w-full">
              Explorer
            </Button>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Diagnostics</h3>
            <p className="text-gray-600">
              Consultez notre base de données de diagnostics chirurgicaux avec leurs caractéristiques.
            </p>
            <Button variant="outline" className="w-full">
              Consulter
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Contributions</h3>
            <p className="text-gray-600">
              Partagez vos propres cas cliniques et contribuez à enrichir notre base de connaissances.
            </p>
            <Button variant="outline" className="w-full">
              Contribuer
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ADC;