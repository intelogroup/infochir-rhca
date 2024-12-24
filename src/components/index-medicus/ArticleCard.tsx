import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Article } from "./types";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {article.imageUrl && (
          <div className="md:w-48 h-48 md:h-auto">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  {article.authors.join(", ")}
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{article.source}</Badge>
                <Badge variant="outline">{article.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {article.abstract}
            </p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-primary/5 text-primary hover:bg-primary/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};