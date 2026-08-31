import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "../../types";
import { formatIssueTitle } from "@/lib/format/issue-title";

interface IssueCardContentProps {
  issue: Issue;
}

export const IssueCardContent = ({ issue }: IssueCardContentProps) => {
  const formattedDate = (() => {
    try {
      const date = new Date(issue.date);
      const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      return format(localDate, "d MMMM yyyy", { locale: fr });
    } catch {
      return "";
    }
  })();

  const reference = `${issue.volume ? `Vol. ${issue.volume}` : "Vol. —"} · ${
    issue.issue ? `No ${issue.issue}` : "No —"
  }`;

  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.14em] text-primary font-medium">
        {reference}
      </p>

      <h3 className="mt-1.5 font-serif text-base leading-snug text-foreground line-clamp-2">
        {formatIssueTitle(issue.title)}
      </h3>

      {formattedDate && (
        <p className="mt-1.5 text-xs text-muted-foreground">{formattedDate}</p>
      )}

      {issue.abstract && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {issue.abstract}
        </p>
      )}
    </div>
  );
};
