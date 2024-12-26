import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
            <TableHead>Titre</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell className="font-medium">{issue.title}</TableCell>
              <TableCell>{issue.volume}</TableCell>
              <TableCell>{issue.issue}</TableCell>
              <TableCell>
                {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="text-secondary hover:text-secondary-light">
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};