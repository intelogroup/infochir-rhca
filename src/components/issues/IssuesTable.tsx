import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Issue } from "./types";

export const IssuesTable = ({ issues }: { issues: Issue[] }) => {
  const handleShare = (issueId: string) => {
    const shareUrl = `${window.location.origin}/rhca/issues/${issueId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien copié dans le presse-papier");
  };

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div 
          key={issue.id}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {issue.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {issue.abstract}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Publié le {new Date(issue.date).toLocaleDateString()}
                </span>
                {issue.views && (
                  <span className="text-sm text-gray-500">
                    {issue.views} vues
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleShare(issue.id)}
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button variant="default" size="sm">
                Lire
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};