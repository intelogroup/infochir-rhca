
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectivesHeader } from "@/components/directives/DirectivesHeader";
import { PublicationsOverview } from "@/components/directives/PublicationsOverview";
import { GeneralGuidelines } from "@/components/directives/GeneralGuidelines";
import { ManuscriptPreparation } from "@/components/directives/ManuscriptPreparation";
import { ReviewProcess } from "@/components/directives/ReviewProcess";
import { ContactSupport } from "@/components/directives/ContactSupport";
import { DirectivesActions } from "@/components/directives/DirectivesActions";

const Directives = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DirectivesHeader 
          title="Directives pour les auteurs"
          description="Guide complet pour soumettre vos manuscrits aux publications d'Info CHIR. Découvrez les directives générales et les exigences spécifiques pour chaque publication."
          backLink="/"
          backText="Retour à l'accueil"
        />

        <div className="space-y-8">
          <PublicationsOverview />
          <GeneralGuidelines />
          <ManuscriptPreparation />
          <ReviewProcess />
          <ContactSupport />
          <DirectivesActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default Directives;
