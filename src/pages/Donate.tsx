
import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { DonateHeader } from "@/components/donate/DonateHeader";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { DonateForm } from "@/components/donate/form/DonateForm";
import { BackButton } from "@/components/donate/BackButton";
import { DonateBackground } from "@/components/donate/DonateBackground";

const Donate = () => {
  // Use with default path-based key
  useScrollToTop();

  return (
    <MainLayout>
      <DonateBackground>
        <div className="mb-8">
          <BackButton />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="donate-form"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DonateHeader />
              <DonateForm />
            </motion.div>
          </AnimatePresence>
        </div>
      </DonateBackground>
    </MainLayout>
  );
};

export default Donate;
