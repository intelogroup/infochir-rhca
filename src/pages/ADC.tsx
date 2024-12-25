import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DiagnosticGrid } from "@/components/DiagnosticGrid";
import { StatsSection } from "@/components/adc/StatsSection";
import { Sidebar } from "@/components/adc/Sidebar";

const ADC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.2'
        }}
      />

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <div className="text-center mb-12 animate-fade-up">
          <img 
            src="/lovable-uploads/a7812203-b420-4326-b13c-95be74502a55.png"
            alt="Atlas ADC Logo"
            className="h-20 w-20 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Atlas de Diagnostic Clinique
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Une base de données visuelle complète pour faciliter le diagnostic clinique et améliorer la pratique médicale.
          </p>

          <StatsSection />
        </div>

        <div className="grid lg:grid-cols-6 gap-6 max-w-[90rem] mx-auto">
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Cas Diagnostiques Récents</h2>
              <DiagnosticGrid />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADC;