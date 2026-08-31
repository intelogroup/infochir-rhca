import React from 'react';
import { CardActions } from "./CardActions";
import type { RhcaArticle } from "../types";
import { formatIssueTitle } from "@/lib/format/issue-title";

interface CardContentProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardContent: React.FC<CardContentProps> = ({ article, pdfUrl }) => {
  const totalPages = (() => {
    try {
      if (!article.pageNumber) return null;
      const pageNumber = String(article.pageNumber).trim();
      if (pageNumber.includes('-')) {
        const end = parseInt(pageNumber.split('-')[1].trim(), 10);
        return isNaN(end) ? null : end;
      }
      const pageNum = parseInt(pageNumber, 10);
      return isNaN(pageNum) ? null : pageNum;
    } catch {
      return null;
    }
  })();

  const reference =
    article.volume && article.issue
      ? `Vol. ${article.volume} · No ${article.issue}`
      : null;

  const formattedDate = article.publicationDate
    ? new Date(article.publicationDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {reference && (
        <p className="text-[11px] uppercase tracking-[0.14em] font-medium text-primary">
          {reference}
        </p>
      )}

      <h3 className="mt-1.5 font-serif text-base leading-snug text-foreground line-clamp-2">
        {formatIssueTitle(article.title)}
      </h3>

      {formattedDate && (
        <p className="mt-1.5 text-xs text-muted-foreground">{formattedDate}</p>
      )}

      {article.abstract && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.abstract}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2">
        <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
          {totalPages && totalPages > 1 ? `${totalPages} pages` : ''}
        </span>
        <CardActions article={article} pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};
