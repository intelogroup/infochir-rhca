import { Eye, Share2, Download } from "lucide-react";

interface AtlasModalStatsProps {
  stats?: {
    views: number;
    shares: number;
    downloads: number;
  };
}

export const AtlasModalStats = ({ stats }: AtlasModalStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Eye className="h-8 w-8 text-primary mb-2" />
        <span className="text-3xl font-bold text-primary">
          {stats?.views || 0}
        </span>
        <span className="text-sm text-gray-500">Vues</span>
      </div>
      <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Share2 className="h-8 w-8 text-primary mb-2" />
        <span className="text-3xl font-bold text-primary">
          {stats?.shares || 0}
        </span>
        <span className="text-sm text-gray-500">Partages</span>
      </div>
      <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Download className="h-8 w-8 text-primary mb-2" />
        <span className="text-3xl font-bold text-primary">
          {stats?.downloads || 0}
        </span>
        <span className="text-sm text-gray-500">Téléchargements</span>
      </div>
    </div>
  );
};