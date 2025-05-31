
import * as React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DebugPanel } from "@/components/admin/debug/DebugPanel";
import { AdminAccessGuard } from "@/components/admin/debug/AdminAccessGuard";

const Debug = () => {
  return (
    <AdminAccessGuard showDebugInfo={true}>
      <div className="space-y-6">
        <PageHeader 
          title="Debug Console" 
          description="Advanced debugging and system monitoring tools"
        />
        <DebugPanel />
      </div>
    </AdminAccessGuard>
  );
};

export default Debug;
