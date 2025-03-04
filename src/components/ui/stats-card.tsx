
import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  iconClassName?: string;
}

export const StatsCard = ({ icon: Icon, title, value, description, iconClassName }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 min-h-[200px] max-h-[260px] h-full">
      <div className="p-3 rounded-full bg-primary/5 mb-4 transform transition-transform group-hover:scale-110">
        <Icon className={`h-6 w-6 ${iconClassName || "text-primary"}`} />
      </div>
      <div className="space-y-2 flex-grow flex flex-col justify-center">
        <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};
