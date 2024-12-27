import { Loader2 } from "lucide-react";

export const UploadingState = () => {
  return (
    <div className="space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-secondary" />
      <p className="text-sm text-gray-500">Upload en cours...</p>
    </div>
  );
};