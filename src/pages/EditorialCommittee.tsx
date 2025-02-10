
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { EditorialTeam } from "@/components/editorial/EditorialTeam";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { EditorialMission } from "@/components/editorial/EditorialMission";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditorialCommittee = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button 
        variant="ghost" 
        size="sm" 
        className="gap-2 text-primary hover:text-primary-light mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>
      
      <EditorialHeader />
      <EditorialMission />
      <EditorialTeam />
    </div>
  </MainLayout>
);

export default EditorialCommittee;
