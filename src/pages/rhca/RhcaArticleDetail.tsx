
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Calendar, Download, FileText, Quote, Share2, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArticleActions } from '@/components/index-medicus/article/ArticleActions';
import { ShareAction } from '@/components/index-medicus/article/actions/ShareAction';
import { PdfActions } from '@/components/index-medicus/article/actions/PdfActions';
import { ViewAction } from '@/components/index-medicus/article/actions/ViewAction';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Article } from "@/components/index-medicus/types/article";
import type { ArticleSource } from "@/components/index-medicus/types";

const RhcaArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();

  // Mock data for demonstration
  const mockArticle: Article = {
    id: articleId || '1',
    title: "Article Title",
    abstract: "This is a mock abstract for the article.",
    authors: ["John Doe", "Jane Smith"],
    publicationDate: "2023-01-01",
    source: "RHCA",
    pdfUrl: "https://example.com/mock.pdf",
    imageUrl: "https://example.com/mock.jpg",
    volume: "1",
    issue: "1",
    pageNumber: "1-10",
    specialty: "General Medicine",
    institution: "Mock Institution",
    category: "Research",
    tags: ["mock", "article"],
    views: 100,
    shares: 10,
    downloads: 50,
    citations: 5,
    status: "published"
  };

  const formattedDate = format(new Date(mockArticle.publicationDate), "PPP", { locale: fr });

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Link to="/rhca">
            <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Retour
            </Button>
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{mockArticle.title}</CardTitle>
            <CardDescription>
              Publié le {formattedDate} par {mockArticle.authors.join(", ")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {mockArticle.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">Résumé</h3>
              <p>{mockArticle.abstract}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{mockArticle.views} vues</span>
              </div>
              <div className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                <span>{mockArticle.citations} citations</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{mockArticle.downloads} téléchargements</span>
              </div>
            </div>

            <div className="border-t py-4">
              <ArticleActions
                title={mockArticle.title}
                pdfUrl={mockArticle.pdfUrl}
                article={mockArticle}
                showViewButton={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RhcaArticleDetail;
