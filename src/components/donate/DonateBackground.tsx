
import React from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";

interface DonateBackgroundProps {
  children: React.ReactNode;
}

export const DonateBackground = ({ children }: DonateBackgroundProps) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Content */}
      <LazyMotion features={domAnimation}>
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          {children}
        </div>
      </LazyMotion>
    </div>
  );
};
