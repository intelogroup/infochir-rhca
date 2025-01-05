import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";

const ADC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted">
        <ADCHeader />
        <ADCMission />
        <ADCSubmission />
      </div>
    </MainLayout>
  );
};

export default ADC;