
import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { TableHeader } from "./table/TableHeader";
import { ArticleTableRow } from "./table/TableRow";
import type { Article } from "@/components/index-medicus/types";

interface ArticleTableProps {
  articles: Article[];
}

export const ArticleTable: React.FC<ArticleTableProps> = ({ articles }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader />
        <TableBody>
          {articles.map((article) => (
            <ArticleTableRow key={article.id} article={article} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
