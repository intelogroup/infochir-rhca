import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

export const StatsCard = ({ icon: Icon, title, value }: StatsCardProps) => (
  <div className="bg-white/95 backdrop-blur-xs rounded-xl p-4 border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/5 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);