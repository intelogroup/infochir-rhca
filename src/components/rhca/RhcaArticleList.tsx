import { RhcaCard } from "./RhcaCard";
import { RhcaTable } from "./RhcaTable";
import type { RhcaArticle } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface RhcaArticleListProps {
  articles: RhcaArticle[];
  viewMode: "grid" | "table";
}

export const RhcaArticleList = ({ articles = [], viewMode }: RhcaArticleListProps) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  const articlesByYear = articles.reduce((acc, article) => {
    const year = new Date(article.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(article);
    return acc;
  }, {} as Record<number, RhcaArticle[]>);

  const sortedYears = Object.keys(articlesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Set the most recent year as expanded by default
  useEffect(() => {
    if (sortedYears.length > 0 && expandedYears.length === 0) {
      setExpandedYears([sortedYears[0]]);
    }
  }, [sortedYears]);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  if (!articles?.length) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-gray-500 text-center">
          Aucun article trouvé
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        {sortedYears.map((year) => (
          <motion.div 
            key={year}
            className="space-y-6 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => toggleYear(year)}
              className="w-full"
              aria-expanded={expandedYears.includes(year)}
              aria-controls={`year-content-${year}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/5 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                      {year}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {articlesByYear[year].length} article{articlesByYear[year].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-secondary/15 px-4 py-2 rounded-full">
                    <FileText className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">
                      {articlesByYear[year].reduce((acc, article) => acc + Number(article.downloads || "0"), 0)} téléchargements
                    </span>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      expandedYears.includes(year) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </button>
            
            <AnimatePresence>
              {expandedYears.includes(year) && (
                <motion.div
                  id={`year-content-${year}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    {articlesByYear[year].map((article) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RhcaCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  }

  return <RhcaTable articles={articles} />;
};