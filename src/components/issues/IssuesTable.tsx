import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import type { Issue } from "./types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface IssuesTableProps {
  issues: Issue[];
}

export const IssuesTable = ({ issues }: IssuesTableProps) => {
  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Journal</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Articles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell>{issue.articleCount} articles</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-secondary hover:text-secondary-light">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};