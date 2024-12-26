import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DiagnosticGrid } from "@/components/diagnostic/DiagnosticGrid";
import { Footer } from "@/components/Footer";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";

const ADC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2 text-secondary hover:text-secondary-light">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </Link>

        <ADCHeader />
        <DiagnosticGrid />
        <ADCMission />
        <ADCSubmission />
        <Footer />
      </div>
    </div>
  );
};

export default ADC;