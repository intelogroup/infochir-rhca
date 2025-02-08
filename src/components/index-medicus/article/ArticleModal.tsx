
import { DocumentModal } from "@/components/shared/DocumentModal";
import { Tag } from "lucide-react";
import type { Article } from "@/types/article";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArticleModalProps {
  article: Article;
  open: boolean;
  onClose: () => void;
}

export const ArticleModal = ({ article, open, onClose }: ArticleModalProps) => {
  const renderContent = (document: Article) => (
    <div className="space-y-6">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-lg font-semibold text-gray-900 mb-4">{document.title}</p>
        <h3 className="text-lg font-semibold text-primary">Résumé</h3>
        <p className="text-gray-600 dark:text-gray-300">{document.abstract}</p>
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-primary mb-3">Articles</h3>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {mockArticleTitles.map((title, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
              >
                <p className="text-sm text-gray-700">{title}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  return (
    <DocumentModal
      document={{
        id: article.id,
        title: `Infochir/RHCA Volume`,
        date: article.publicationDate.toISOString(),
        description: article.title,
        downloadCount: article.downloads || 0,
        shareCount: article.shares || 0,
        pdfUrl: article.pdfUrl,
        imageUrl: article.imageUrl,
      }}
      open={open}
      onClose={onClose}
      renderContent={() => renderContent(article)}
    />
  );
};

// Temporary mock data for demonstration
const mockArticleTitles = [
  "Martin et al. - L'impact des nouvelles technologies en chirurgie cardiaque",
  "Dubois et al. - Évolution des techniques de transplantation hépatique",
  "Bernard et al. - Innovations en chirurgie mini-invasive",
  "Lambert et al. - Approches modernes en chirurgie pédiatrique",
  "Robert et al. - Techniques avancées en neurochirurgie",
  "Dupont et al. - Les progrès en chirurgie robotique",
  "Claire et al. - Nouvelles perspectives en chirurgie plastique",
  "Pierre et al. - Développements récents en chirurgie orthopédique",
  "Sophie et al. - Avancées en chirurgie vasculaire",
  "Jean et al. - La chirurgie assistée par ordinateur : état des lieux",
  "Marie et al. - Techniques émergentes en microchirurgie",
  "Paul et al. - L'intelligence artificielle en chirurgie",
];
