import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  iconClassName?: string;
}

export const StatsCard = ({ icon: Icon, title, value, iconClassName }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-3 rounded-xl bg-secondary/10 backdrop-blur-sm transform transition-transform group-hover:scale-110">
        <Icon className={`h-6 w-6 ${iconClassName}`} />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
  );
};