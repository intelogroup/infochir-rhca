
import React from "react";
import { ArticleActions } from "./ArticleActions";
import { ArticleTags } from "./ArticleTags";
import type { Article } from "../types";

interface ArticleTableRowProps {
  article: Article;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTableRow: React.FC<ArticleTableRowProps> = ({
  article,
  onTagClick,
  selectedTags = []
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getFirstAuthor = () => {
    if (article.authors && article.authors.length > 0) {
      return article.authors[0];
    }
    return article.primary_author || 'Auteur inconnu';
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors h-16">
      <td className="py-2 px-3">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
            {article.title}
          </h3>
          {article.tags && article.tags.length > 0 && (
            <ArticleTags
              tags={article.tags.slice(0, 3)}
              onTagClick={onTagClick}
              selectedTags={selectedTags}
              size="sm"
            />
          )}
        </div>
      </td>
      
      <td className="py-2 px-3 hidden md:table-cell">
        <div className="text-sm text-gray-600 line-clamp-2">
          {getFirstAuthor()}
          {article.authors && article.authors.length > 1 && (
            <span className="text-gray-400 ml-1">
              +{article.authors.length - 1}
            </span>
          )}
        </div>
      </td>
      
      <td className="py-2 px-3 hidden lg:table-cell">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {article.source || 'N/A'}
        </span>
      </td>
      
      <td className="py-2 px-3 text-sm text-gray-500 hidden xl:table-cell">
        {formatDate(article.publication_date)}
      </td>
      
      <td className="py-2 px-3">
        <div className="flex justify-end">
          <ArticleActions article={article} />
        </div>
      </td>
    </tr>
  );
};
