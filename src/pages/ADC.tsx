import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";

const ADC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 pt-[70px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ADCHeader />
                <ADCMission />
                <ADCSubmission />
              </>
            }
          />
        </Routes>
      </div>
    </MainLayout>
  );
};

export default ADC;