import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ArticleActionsProps {
  onAddClick: () => void;
}

export const ArticleActions = ({ onAddClick }: ArticleActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
        <p className="text-sm text-gray-500">Manage your articles here</p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add Article
      </Button>
    </div>
  );
};