
import * as React from "react";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";

interface IssueCardActionsProps {
  pdfUrl?: string;
  id: string;
  title: string;
}

export const IssueCardActions: React.FC<IssueCardActionsProps> = ({
  pdfUrl,
  id,
  title
}) => {
  return (
    <div className="flex items-center gap-0.5">
      <ShareAction
        id={id}
        title={title}
        contentType="igm"
        className="bg-blue-50 px-1 py-0.5 rounded text-blue-700 hover:bg-blue-100 transition-all duration-200 text-[8px] font-medium h-4"
      />
      
      {pdfUrl && (
        <>
          <OpenAction
            id={id}
            pdfUrl={pdfUrl}
            className="bg-green-50 px-1 py-0.5 rounded text-green-700 hover:bg-green-100 transition-all duration-200 text-[8px] font-medium h-4"
          />
          
          <DownloadAction
            id={id}
            title={title}
            pdfUrl={pdfUrl}
            contentType="igm"
            className="bg-amber-50 px-1 py-0.5 rounded text-amber-700 hover:bg-amber-100 transition-all duration-200 text-[8px] font-medium h-4"
          />
        </>
      )}
    </div>
  );
};
