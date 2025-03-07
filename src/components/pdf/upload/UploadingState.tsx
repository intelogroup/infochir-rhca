
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UploadingStateProps {
  message?: string;
}

export const UploadingState = ({ message = "Upload en cours..." }: UploadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner 
        size="md" 
        variant="default" 
        text={message}
      />
    </div>
  );
};
