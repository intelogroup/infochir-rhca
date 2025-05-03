
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Article } from "./types";
import { User, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface IndexMedicusCardProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  isSelected?: boolean;
  hideImage?: boolean;
}

export const IndexMedicusCard: React.FC<IndexMedicusCardProps> = ({
  article,
  onTagClick,
  isSelected = false,
  hideImage = false,
}) => {
  const isMobile = useIsMobile();
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
      })
    : "";

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    e.preventDefault();
    onTagClick && onTagClick(tag);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "h-full rounded-lg overflow-hidden",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <Card
        className="h-full flex flex-col border-gray-200 hover:border-primary/30 cursor-pointer transition-all duration-200 overflow-hidden group"
      >
        <CardContent className="flex-grow flex flex-col p-3 sm:p-4">
          <div className="flex-grow space-y-2">
            <h3 className="font-medium text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User className="h-3 w-3 text-gray-400" />
              <span className="truncate max-w-[200px]">
                {article.authors?.join(", ") || "Unknown authors"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{formattedDate || "Date inconnue"}</span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1 mb-1">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, isMobile ? 3 : 5).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {article.tags.length > (isMobile ? 3 : 5) && (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      +{article.tags.length - (isMobile ? 3 : 5)}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
