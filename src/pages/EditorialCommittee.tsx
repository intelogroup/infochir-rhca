
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { EditorialTeam } from "@/components/editorial/EditorialTeam";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { EditorialMission } from "@/components/editorial/EditorialMission";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const EditorialCommittee = () => (
  <MainLayout>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-primary hover:text-primary-light mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </motion.div>
        
        <EditorialHeader />
        <EditorialMission />
        <EditorialTeam />
      </div>
    </div>
  </MainLayout>
);

export default EditorialCommittee;
