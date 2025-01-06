import { YearGroup } from "@/components/issues/YearGroup";
import type { Issue } from "../types";

interface YearGroupListProps {
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const YearGroupList = ({ issuesByYear, sortedYears }: YearGroupListProps) => {
  return (
    <div 
      className="space-y-6"
      role="list"
      aria-label="Issues par année"
    >
      {sortedYears.map((year) => (
        <YearGroup
          key={`year-${year}`}
          year={year}
          issues={issuesByYear[year]}
        />
      ))}
    </div>
  );
};