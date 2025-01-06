import { YearGroup } from "@/components/issues/YearGroup";
import type { Issue } from "../types";
import { motion } from "framer-motion";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear, sortedYears }: YearGroupListProps) => {
  return (
    <motion.div 
      className="space-y-8"
      role="list"
      aria-label="Issues par année"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {sortedYears.map((year, index) => (
        <motion.div
          key={`year-${year}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <YearGroup
            year={year}
            issues={issuesByYear[year]}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};