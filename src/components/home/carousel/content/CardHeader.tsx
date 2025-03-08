
import { Badge } from "@/components/ui/badge";

interface CardHeaderProps {
  image: string;
  title: string;
  category?: string;
  isModal?: boolean;
}

export const CardHeader = ({ image, title, category, isModal = false }: CardHeaderProps) => {
  return (
    <div className={`relative ${isModal ? 'h-52 sm:h-64' : 'h-40'}`}>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {category && (
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white/80">
            {category}
          </Badge>
        </div>
      )}
    </div>
  );
};
