
import React, { useEffect } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { motion } from "framer-motion";
import { useAtlasArticles } from "@/components/atlas/hooks/useAtlasArticles";

const ADC = () => {
  const { data: articles, isLoading, error } = useAtlasArticles();

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ADCHeader />
        <ADCMission />
        <ADCSubmission />
      </motion.div>
    </MainLayout>
  );
};

export default ADC;
