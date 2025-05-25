
import { EmailConfigStatus } from "@/components/admin/EmailConfigStatus";
import { PageHeader } from "@/components/ui/page-header";

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configuration Email" 
        description="Gérez et vérifiez la configuration de votre service email Resend"
      />
      
      <EmailConfigStatus />
    </div>
  );
}
