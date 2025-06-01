
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Calendar, BookOpen, FileText, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";
import type { Issue } from "../../types";

interface IGMIssueModalProps {
  issue: Issue;
  open: boolean;
  onClose: () => void;
}

export const IGMIssueModal = ({ issue, open, onClose }: IGMIssueModalProps) => {
  // Calculate total pages
  const getTotalPages = () => {
    if (issue.pageCount) return issue.pageCount;
    
    if (!issue.articles || issue.articles.length === 0) return 0;
    
    let maxPage = 0;
    issue.articles.forEach(article => {
      if (!article.pageNumber) return;
      
      const pageNumber = article.pageNumber.toString().trim();
      if (pageNumber.includes('-')) {
        const [, end] = pageNumber.split('-').map(num => parseInt(num.trim(), 10));
        if (!isNaN(end) && end > maxPage) maxPage = end;
      } else {
        const pageNum = parseInt(pageNumber, 10);
        if (!isNaN(pageNum) && pageNum > maxPage) maxPage = pageNum;
      }
    });
    
    return maxPage;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const localDate = new Date(year, month, day);
      return format(localDate, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] p-0 overflow-hidden bg-white/95 backdrop-blur-sm flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl md:text-2xl font-bold text-primary line-clamp-2 leading-tight mb-2">
                {issue.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(issue.date)}
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full">
                  <FileText className="h-4 w-4" />
                  {issue.volume ? `Vol. ${issue.volume}` : 'Vol. -'} • {issue.issue ? `No. ${issue.issue}` : 'No. -'}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {getTotalPages()} pages
                </div>
              </div>
            </div>
          </div>
          
          {issue.abstract && (
            <DialogDescription className="text-sm text-gray-600 leading-relaxed">
              {issue.abstract}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <motion.div 
            className="p-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Statistics Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-primary mb-3">Statistiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{issue.articles?.length || 0}</div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(issue.downloads || issue.downloadCount) || 0}</div>
                  <div className="text-sm text-gray-600">Téléchargements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{(issue.shares || issue.shareCount) || 0}</div>
                  <div className="text-sm text-gray-600">Partages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{getTotalPages()}</div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
              </div>
            </div>

            {/* Articles Section */}
            {issue.articles && issue.articles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Table des matières</h3>
                <div className="space-y-3">
                  {issue.articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2 leading-tight">
                            {article.title}
                          </h4>
                          {article.authors && article.authors.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <Users className="h-3 w-3" />
                              {article.authors.join(", ")}
                            </div>
                          )}
                          {article.abstract && (
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {article.abstract}
                            </p>
                          )}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                >
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {article.pageNumber && (
                          <div className="text-sm text-gray-500 font-medium">
                            Page {article.pageNumber}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <ShareAction
                id={issue.id}
                title={issue.title}
                contentType="igm"
                size="sm"
                variant="outline"
              />
              
              {issue.pdfUrl && (
                <>
                  <OpenAction
                    id={issue.id}
                    pdfUrl={issue.pdfUrl}
                    size="sm"
                    variant="outline"
                  />
                  
                  <DownloadAction
                    id={issue.id}
                    title={issue.title}
                    pdfUrl={issue.pdfUrl}
                    contentType="igm"
                    size="sm"
                    variant="default"
                  />
                </>
              )}
            </div>
          </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
