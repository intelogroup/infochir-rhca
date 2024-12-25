import { memo } from "react";
import { MonthGroup } from "./MonthGroup";
import { YearGroup as YearGroupType } from "./types";

interface YearGroupProps {
  yearGroup: YearGroupType;
  monthNames: string[];
}

export const YearGroup = memo(({ yearGroup, monthNames }: YearGroupProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {yearGroup.year}
      </h2>
      <div className="space-y-8">
        {yearGroup.months.map((monthGroup) => (
          <MonthGroup
            key={monthGroup.month}
            monthGroup={monthGroup}
            monthName={monthNames[monthGroup.month]}
          />
        ))}
      </div>
    </div>
  );
});

YearGroup.displayName = "YearGroup";