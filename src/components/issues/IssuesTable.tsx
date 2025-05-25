
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "@/components/igm/types";  // Updated import

interface IssuesTableProps {
  issues: Issue[];
}

export const IssuesTable = ({ issues }: IssuesTableProps) => {
  // Helper function to format date consistently
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Use UTC to avoid timezone issues
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      
      // Create a new date with UTC values but interpret them as local
      const localDate = new Date(year, month, day);
      
      return format(localDate, 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date in table:', error, dateString);
      return 'Date invalide';
    }
  };

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
            <TableCell>{formatDate(issue.date)}</TableCell>
            <TableCell>{issue.articleCount || (issue.articles?.length) || 0}</TableCell>
            <TableCell>{(issue.downloads || issue.downloadCount) || 0}</TableCell>
            <TableCell>{(issue.shares || issue.shareCount) || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
