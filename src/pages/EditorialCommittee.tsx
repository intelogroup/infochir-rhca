import { MainLayout } from "@/components/layouts/MainLayout";
import { EditorialTeam } from "@/components/editorial/EditorialTeam";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { EditorialMission } from "@/components/editorial/EditorialMission";

const EditorialCommittee = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EditorialHeader />
      <EditorialMission />
      <EditorialTeam />
    </div>
  </MainLayout>
);

export default EditorialCommittee;