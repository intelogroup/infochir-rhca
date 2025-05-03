
import { Loader2 } from "lucide-react";

interface UploadingStateProps {
  currentFile?: string;
}

export const UploadingState = ({ currentFile }: UploadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <div>
        <p className="text-sm font-medium">Upload en cours...</p>
        {currentFile && (
          <p className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
            {currentFile}
          </p>
        )}
      </div>
    </div>
  );
};
