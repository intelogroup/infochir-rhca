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
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6 text-left transition-colors duration-200 hover:border-primary/50">
      <Icon className={`h-5 w-5 ${iconClassName || "text-primary"}`} aria-hidden="true" />
      <p className="mt-6 font-serif text-4xl leading-none text-foreground">{value}</p>
      <p className="type-eyebrow mt-3">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
};
