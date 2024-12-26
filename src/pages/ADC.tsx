import { Button } from "@/components/ui/button";
import { ArrowLeft, List } from "lucide-react";
import { Link } from "react-router-dom";
import { DiagnosticGrid } from "@/components/diagnostic/DiagnosticGrid";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ADC = () => {
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
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
                    className="text-sm hover:text-primary cursor-pointer transition-colors"
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
    </div>
  );
};

const tableOfContents = [
  "1- TRAUMA – PLAIES - BRULURES",
  "2- PEAU ET TISSUS SOUS CUTANES - INFECTIONS - SARCOMES",
  "3- SEIN",
  "4- NEURO CHIRURGIE",
  "5- OPHTALMO ORL CMF",
  "6- COU",
  "7- THORAX",
  "8- VASCULAIRE ARTERIEL ET ANEVRISMES",
  "9- VASCULAIRE VEINEUX ET LYMPHATIQUE",
  "10- DE L'ŒSOPHAGE, DIAPHRAGME A ILEON",
  "11- DE APPENDICE A ANUS",
  "12- FOIE – VBEH – PANCREAS – RATE",
  "13- CAVITE ABD – OMENTUM – MESENTERE – RETRO PERITOINE",
  "14- PARIO ABD – HERNIE – EVENTRATION – EVISCERATION",
  "15- PERINEE ET FESSES",
  "16- CHIRURGIE PEDIATRIQUE",
  "17- UROLOGIE ET APP GENITAL HOMME",
  "18- OBGN ET APP GEN FEMME",
  "19- ORTHOPEDIE – APP LOCO MOTEUR",
  "20- GIGANTISMES",
  "21- CORPS ETRANGERS",
  "22- CHIRURGIE RECONSTRUCTIVE",
  "23- BRÛLURES"
];

export default ADC;