import { IssueCard } from "@/components/igm/IssueCard";
import { Calendar, FileText } from "lucide-react";
import type { Issue } from "@/components/igm/types";
import { motion } from "framer-motion";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear, sortedYears }: YearGroupListProps) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {sortedYears.map((year) => (
        <motion.div 
          key={year}
          className="space-y-4 sm:space-y-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          role="region"
          aria-labelledby={`year-heading-${year}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 sm:pb-4 gap-2 sm:gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 p-2 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <motion.h2 
                  id={`year-heading-${year}`}
                  className="text-lg sm:text-xl font-semibold text-primary tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {year}
                </motion.h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {issuesByYear[year].length} numéro{issuesByYear[year].length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-2 bg-secondary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary-foreground/70" />
              <span className="text-xs sm:text-sm font-medium text-secondary-foreground/70">
                {issuesByYear[year].reduce((acc, issue) => acc + (issue.articles?.length || 0), 0)} articles
              </span>
            </motion.div>
          </div>
          
          <div 
            className="grid grid-cols-1 gap-3 sm:gap-4"
            role="list"
            aria-label={`Issues de ${year}`}
          >
            {issuesByYear[year].map((issue, index) => (
              <motion.div
                key={`${year}-${issue.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <IssueCard issue={issue} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};