import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Founder } from "@/hooks/useFounders";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FounderCardProps {
  founder: Founder;
  onClick: () => void;
  memorialStyle?: boolean;
}

export const FounderCard = ({ founder, onClick, memorialStyle = false }: FounderCardProps) => {
  const initials = founder.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full w-full flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 text-center transition-colors hover:border-primary/40",
        memorialStyle && "opacity-80 hover:opacity-100"
      )}
    >
      <Avatar className="h-20 w-20 border border-border sm:h-24 sm:w-24">
        {founder.image ? (
          <AvatarImage
            src={founder.image}
            alt={founder.name}
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "";
            }}
          />
        ) : (
          <AvatarFallback className="bg-muted text-lg text-foreground">{initials}</AvatarFallback>
        )}
      </Avatar>

      <div className="w-full space-y-1.5">
        <h3 className="type-h3 break-words text-foreground">{founder.name}</h3>
        {founder.title && (
          <p className="text-sm text-foreground/70">{founder.title}</p>
        )}
        {founder.role && (
          <p className="text-xs leading-relaxed text-muted-foreground">{founder.role}</p>
        )}
      </div>

      {founder.specialties && founder.specialties.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {founder.specialties.slice(0, 2).map((specialty, index) => (
            <Badge
              key={index}
              variant="outline"
              className="max-w-full whitespace-normal border-border text-[11px] font-normal text-muted-foreground"
            >
              {specialty}
            </Badge>
          ))}
          {founder.specialties.length > 2 && (
            <Badge variant="outline" className="border-border text-[11px] font-normal text-muted-foreground">
              +{founder.specialties.length - 2}
            </Badge>
          )}
        </div>
      )}
    </button>
  );
};
