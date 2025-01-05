import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "@/components/igm/types";

interface IssuesTableProps {
  issues: Issue[];
}

export const IssuesTable = ({ issues }: IssuesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Numéro</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Articles</TableHead>
          <TableHead>Téléchargements</TableHead>
          <TableHead>Partages</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell className="font-medium">{issue.title}</TableCell>
            <TableCell>{issue.volume}</TableCell>
            <TableCell>{issue.issue}</TableCell>
            <TableCell>
              {format(new Date(issue.date), 'MMMM yyyy', { locale: fr })}
            </TableCell>
            <TableCell>{issue.articleCount}</TableCell>
            <TableCell>{issue.downloads || 0}</TableCell>
            <TableCell>{issue.shares || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};