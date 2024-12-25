import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Article } from "@/types/article";

interface SubmitButtonProps {
  isLoading: boolean;
  article: Article | null;
}

export const SubmitButton = ({ isLoading, article }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : article ? (
        "Update Article"
      ) : (
        "Add Article"
      )}
    </Button>
  );
};