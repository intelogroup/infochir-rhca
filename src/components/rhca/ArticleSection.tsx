import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RhcaArticle } from "./types";

interface ArticleSectionProps {
  title: string;
  articles: RhcaArticle[];
}

export const ArticleSection = ({ title, articles }: ArticleSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {article.authors.join(", ")}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                Page {article.pageNumber}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};