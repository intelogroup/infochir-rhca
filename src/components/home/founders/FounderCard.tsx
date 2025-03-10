
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Founder } from "@/hooks/useFounders";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface FounderCardProps {
  founder: Founder;
  onClick: () => void;
  memorialStyle?: boolean;
}

export const FounderCard = ({ founder, onClick, memorialStyle = false }: FounderCardProps) => {
  // Generate initials from name
  const initials = founder.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  
  return (
    <Card 
      className={cn(
        "h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg relative",
        memorialStyle ? "border-gray-300 opacity-80 hover:opacity-100" : "hover:border-blue-500"
      )}
      onClick={onClick}
    >
      {memorialStyle && (
        <div className="absolute inset-0 bg-gray-900 opacity-10 pointer-events-none z-10"></div>
      )}
      
      <div className="flex flex-col items-center p-6 text-center gap-4">
        <Avatar className="h-32 w-32 border-2 border-white shadow-md">
          {founder.image ? (
            <AvatarImage 
              src={founder.image} 
              alt={founder.name} 
              className="object-cover"
              onError={(e) => {
                console.log(`Failed to load avatar for ${founder.name} from ${founder.image}`);
                const target = e.target as HTMLImageElement;
                // Remove src to show the fallback
                target.src = "";
              }}
            />
          ) : (
            <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        
        <CardContent className="p-0 space-y-2">
          <h3 className={cn(
            "font-bold text-xl", 
            memorialStyle ? "text-gray-700" : "text-blue-800"
          )}>
            {founder.name}
          </h3>
          <p className="text-gray-600 font-medium">{founder.title}</p>
          <p className="text-sm text-gray-500">{founder.role}</p>
          
          {founder.specialties && founder.specialties.length > 0 && (
            <div className="pt-2 flex flex-wrap justify-center gap-1">
              {founder.specialties.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {founder.specialties.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{founder.specialties.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </div>
      
      {memorialStyle && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 py-1 text-center text-xs text-gray-500">
          In Memoriam
        </div>
      )}
    </Card>
  );
};
