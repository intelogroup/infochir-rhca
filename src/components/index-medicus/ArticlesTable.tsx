import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArticleWithRelations } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { FileIcon, FileTextIcon, ImageIcon } from "lucide-react";
import { PDFViewer } from "@/components/rhca/PDFViewer";

interface ArticlesTableProps {
  articles: ArticleWithRelations[];
}

export const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  const getFileType = (article: ArticleWithRelations) => {
    if (article.pdf_url) return 'PDF';
    if (article.image_url) return 'Image';
    return 'Text';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileIcon className="h-4 w-4 text-red-500" />;
      case 'Image':
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <FileTextIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Auteurs</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => {
            const fileType = getFileType(article);
            return (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFileIcon(fileType)}
                    {fileType}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{article.source}</Badge>
                </TableCell>
                <TableCell className="font-medium max-w-md truncate">
                  {article.title}
                </TableCell>
                <TableCell>{article.category?.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {article.article_authors?.map(a => a.author.name).join(", ")}
                </TableCell>
                <TableCell>
                  {new Date(article.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <PDFViewer
                    pdfUrl={article.pdf_url}
                    title={article.title}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};