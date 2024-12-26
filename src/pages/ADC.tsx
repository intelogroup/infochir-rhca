import { MainLayout } from "@/components/layouts/MainLayout";
import { DiagnosticGrid } from "@/components/diagnostic/DiagnosticGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const tableOfContents = [
  "INTRODUCTION À L'ATLAS (MàJ: 23/07/24)",
  "1- TRAUMA – PLAIES - BRULURES (MàJ: 12/04/24)",
  "2- PEAU ET TISSUS SOUS CUTANÉS - INFECTIONS - TUMEURS (MàJ: 30/03/23)",
  "3- SEIN (MàJ: 11/10/21)",
  "4- NEURO CHIRURGIE (MàJ: 11/10/21)",
  "5- OPHTALMO ORL CMF (MàJ: 30/03/22)",
  "6- COU (MàJ: 29/05/24)",
  "7- THORAX (MàJ: 12/04/24)",
  "8- VASCULAIRE ARTÉRIEL ET ANÉVRISMES (MàJ: 17/08/22)",
  "9- VASCULAIRE VEINEUX ET LYMPHATIQUE (À venir)",
  "10- DE L'ŒSOPHAGE, DIAPHRAGME À ILÉON (À venir)",
  "11- DE APPENDICE À ANUS (À venir)",
  "12- FOIE – VBEH – PANCRÉAS – RATE (MàJ: 02/01/22)",
  "13- CAVITÉ ABD – OMENTUM – MÉSENTÈRE – RÉTRO PÉRITOINE (À venir)",
  "14- PARIO ABD – HERNIE – ÉVENTRATION – ÉVISCERATION (MàJ: 04/01/24)",
  "15- PÉRINÉE ET FESSES (MàJ: 20/10/21)",
  "16- CHIRURGIE PÉDIATRIQUE (MàJ: 22/11/22)",
  "17- UROLOGIE ET APP GÉNITAL HOMME (MàJ: 18/02/23)",
  "18- OBGN ET APP GÉN FEMME (MàJ: 09/10/22)",
  "19- ORTHOPÉDIE – APP LOCO MOTEUR (MàJ: 11/10/21)",
  "20- GIGANTISMES (MàJ: 02/01/22)",
  "21- CORPS ÉTRANGERS (À venir)",
  "22- CHIRURGIE RECONSTRUCTIVE (À venir)",
  "23- BRÛLURES (À venir)"
];

const ADC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary/80">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <List className="h-4 w-4" />
                Table des matières
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Table des matières</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {tableOfContents.map((item, index) => (
                  <div 
                    key={index}
                    className="text-sm hover:text-primary cursor-pointer transition-colors duration-200 p-2 rounded-md hover:bg-gray-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
            alt="Atlas ADC Logo"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Atlas de Diagnostic Chirurgical
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une collection complète de ressources visuelles pour le diagnostic chirurgical
          </p>
        </div>

        <DiagnosticGrid />
      </div>
    </MainLayout>
  );
};

export default ADC;