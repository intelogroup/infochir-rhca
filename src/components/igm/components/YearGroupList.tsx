
import { IssueCard } from "@/components/igm/IssueCard";
import { Calendar, FileText } from "lucide-react";
import type { Issue } from "@/components/igm/types";
import { motion, AnimatePresence } from "framer-motion";
import { memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

const YearHeader = memo(({ year, issueCount, articleCount }: { year: number; issueCount: number; articleCount: number }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2.5 rounded-lg">
        <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div>
        <motion.h2 
          id={`year-heading-${year}`}
          className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {year}
        </motion.h2>
        <p className="text-sm text-gray-600 mt-0.5">
          {issueCount} numéro{issueCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
    <motion.div 
      className="flex items-center gap-2 bg-secondary/15 px-4 py-2 rounded-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <FileText className="h-4 w-4 text-gray-700" />
      <span className="text-sm font-medium text-gray-700">
        {articleCount} articles
      </span>
    </motion.div>
  </div>
));

YearHeader.displayName = 'YearHeader';

export const YearGroupList = memo(({ issuesByYear, sortedYears }: YearGroupListProps) => {
  return (
    <Accordion type="multiple" className="space-y-6">
      <AnimatePresence>
        {sortedYears.map((year) => {
          const issues = issuesByYear[year];
          const articleCount = issues.reduce((acc, issue) => acc + (issue.articles?.length || 0), 0);
          
          return (
            <AccordionItem
              key={year}
              value={year.toString()}
              className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="hover:no-underline">
                <YearHeader 
                  year={year} 
                  issueCount={issues.length}
                  articleCount={articleCount}
                />
              </AccordionTrigger>
              
              <AccordionContent>
                <motion.div 
                  className="grid grid-cols-1 gap-4 pt-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  role="list"
                  aria-label={`Issues de ${year}`}
                >
                  <AnimatePresence>
                    {issues.map((issue, index) => (
                      <motion.div
                        key={`${year}-${issue.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                      >
                        <IssueCard issue={issue} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </AnimatePresence>
    </Accordion>
  );
});

YearGroupList.displayName = 'YearGroupList';
