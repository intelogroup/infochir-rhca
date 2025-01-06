import { Table, TableBody } from "@/components/ui/table";
import { TableHeader } from "./table/TableHeader";
import { ArticleTableRow } from "./table/TableRow";
import type { Article } from "./types";

export const ArticleTable = ({ articles }: { articles: Article[] }) => {
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