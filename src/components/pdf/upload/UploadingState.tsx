
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const UploadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <LoadingSpinner 
        size="md" 
        variant="default" 
        text="Upload en cours..."
      />
    </div>
  );
};
