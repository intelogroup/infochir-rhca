import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconClassName?: string;
}

export const StatsCard = ({ icon: Icon, title, value, iconClassName }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="p-2 rounded-lg bg-secondary/10">
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
  );
};