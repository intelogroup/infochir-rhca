import { Eye, Share2, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface AtlasModalStatsProps {
  stats?: {
    views: number;
    shares: number;
    downloads: number;
  };
}

export const AtlasModalStats = ({ stats }: AtlasModalStatsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-6 text-sm text-gray-500"
    >
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4" />
        <span>{stats?.views || 0}</span>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        <span>{stats?.shares || 0}</span>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        <span>{stats?.downloads || 0}</span>
      </div>
    </motion.div>
  );
};