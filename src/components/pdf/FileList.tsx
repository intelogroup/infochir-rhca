import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileListProps {
  files: string[];
  onRemove: (url: string) => void;
  isUploading: boolean;
}

export const FileList = ({ files, onRemove, isUploading }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <ul className="space-y-2">
      {files.map((url, index) => (
        <li 
          key={url} 
          className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-secondary" />
            <span className="text-sm truncate max-w-[200px]">
              Fichier {index + 1}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(url)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
};