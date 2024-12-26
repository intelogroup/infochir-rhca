import { Issue } from "./types";
import { IssueCard } from "./IssueCard";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold text-primary">{year}</h2>
      <div className="grid gap-2">
        {issues.map((issue) => (
          <IssueCard 
            key={issue.id}
            id={issue.id}
            title={issue.title}
            volume={issue.volume || ""}
            issue={issue.issue || ""}
            date={issue.date}
            articleCount={issue.articleCount}
            pdfUrl={issue.pdfUrl}
            coverImage={issue.coverImage}
          />
        ))}
      </div>
    </div>
  );
};