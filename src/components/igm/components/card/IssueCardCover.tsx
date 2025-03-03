
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface IssueCardCoverProps {
  coverImage?: string;
  title: string;
}

export const IssueCardCover = ({ coverImage, title }: IssueCardCoverProps) => {
  return (
    <AspectRatio ratio={3/4} className="overflow-hidden rounded-lg bg-muted/10">
      <ImageOptimizer
        src={coverImage}
        alt={`Couverture ${title}`}
        width={120}
        height={160}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        fallbackText="Image non disponible"
      />
    </AspectRatio>
  );
};
