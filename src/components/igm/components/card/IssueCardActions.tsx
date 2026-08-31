import * as React from "react";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";

interface IssueCardActionsProps {
  pdfUrl?: string;
  id: string;
  title: string;
}

const actionClass =
  "h-7 px-2 rounded-none bg-transparent text-xs font-medium text-foreground/70 hover:text-primary hover:bg-transparent";

export const IssueCardActions: React.FC<IssueCardActionsProps> = ({
  pdfUrl,
  id,
  title
}) => {
  return (
    <div className="flex items-center gap-1">
      <ShareAction id={id} title={title} contentType="igm" className={actionClass} />

      {pdfUrl && (
        <>
          <OpenAction id={id} pdfUrl={pdfUrl} className={actionClass} />
          <DownloadAction
            id={id}
            title={title}
            pdfUrl={pdfUrl}
            contentType="igm"
            className={actionClass}
          />
        </>
      )}
    </div>
  );
};
