
import React, { useState } from "react";
import { Article } from "./types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TableActions } from "./table/TableActions";
import { Button } from "@/components/ui/button";

interface ArticleCompactListProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= maxLength) {
    return <p className="text-sm text-gray-600">{text}</p>;
  }
  
  return (
    <div>
      <p className="text-sm text-gray-600">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <Button 
        variant="link" 
        size="sm" 
        className="p-0 h-auto font-medium text-primary" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Read more"}
      </Button>
    </div>
  );
};

export const ArticleCompactList: React.FC<ArticleCompactListProps> = ({ 
  articles, 
  onTagClick,
  selectedTags = []
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun article trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <Card key={article.id} className="p-3 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="font-semibold text-base leading-tight mb-1 text-primary line-clamp-2">
                {article.title}
              </h3>
              
              <div className="flex flex-col gap-1 mb-2">
                <div className="text-xs text-gray-600 flex items-center">
                  <span className="font-medium mr-2">Auteurs:</span>
                  <ExpandableText 
                    text={article.authors?.join(", ") || "Unknown authors"} 
                    maxLength={40}
                  />
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="font-medium">Date:</span>
                  <span>
                    {article.date ? new Date(article.date).getFullYear() : "Date inconnue"}
                  </span>
                  <span className="mx-1">•</span>
                  <span className="font-medium">Source:</span>
                  <span className="truncate max-w-[150px]">{article.source || "Unknown"}</span>
                </div>
              </div>
              
              {article.abstract && (
                <div className="mt-1 mb-2">
                  <ExpandableText text={article.abstract} maxLength={80} />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1 max-w-[80%]">
                {article.tags?.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`text-xs hover:bg-primary/10 cursor-pointer truncate max-w-[100px] ${
                      selectedTags?.includes(tag) ? "bg-primary/20" : "bg-muted"
                    }`}
                    onClick={() => onTagClick && onTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {(article.tags?.length || 0) > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-muted cursor-pointer"
                  >
                    +{(article.tags?.length || 0) - 2}
                  </Badge>
                )}
              </div>
              
              <TableActions row={{ original: { id: article.id, title: article.title } }} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
