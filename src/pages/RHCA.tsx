import { MainLayout } from "@/components/layouts/MainLayout";
import { AdminPanel } from "@/components/rhca/AdminPanel";

const RHCA = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <AdminPanel />
      </div>
    </MainLayout>
  );
};

export default RHCA;