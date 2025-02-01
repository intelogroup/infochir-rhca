import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconClassName?: string;
}

export const StatsCard = ({ icon: Icon, title, value, iconClassName }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="p-2 rounded-xl bg-secondary/10 backdrop-blur-sm transform transition-transform group-hover:scale-110">
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-xs font-medium text-gray-600">{title}</p>
      </div>
    </div>
  );
};