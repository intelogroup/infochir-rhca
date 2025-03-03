
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { IGMEditorialCommittee } from "@/components/editorial/IGMEditorialCommittee";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const IGMEditorialCommitteePage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/igm" className="inline-block mb-8">
        <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
          <ArrowLeft className="h-4 w-4" />
          Retour à IGM
        </Button>
      </Link>
      
      <EditorialHeader />
      <IGMEditorialCommittee />
    </div>
  </MainLayout>
);

export default IGMEditorialCommitteePage;
