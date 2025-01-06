import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Issue } from "../../types";

interface IssueModalHeaderProps {
  issue: Issue;
}

export const IssueModalHeader = ({ issue }: IssueModalHeaderProps) => {
  return (
    <DialogHeader className="p-6 pb-0">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle className="text-[clamp(1.5rem,1.35rem+0.75vw,2rem)] font-bold text-primary leading-tight">
          {issue.title}
        </DialogTitle>
      </motion.div>
      <DialogDescription className="text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 mt-2 leading-relaxed">
        {issue.abstract}
      </DialogDescription>
    </DialogHeader>
  );
};