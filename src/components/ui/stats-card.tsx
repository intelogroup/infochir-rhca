import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

export const StatsCard = ({ icon: Icon, title, value }: StatsCardProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-xs rounded-xl p-6 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/5 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};