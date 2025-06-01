
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface IssueCardCoverProps {
  coverImage?: string;
  title: string;
}

export const IssueCardCover = ({ coverImage, title }: IssueCardCoverProps) => {
  return (
    <div className="w-full h-full overflow-hidden rounded-t-lg bg-muted/10">
      <ImageOptimizer
        src={coverImage}
        alt={`Couverture ${title}`}
        width={200}
        height={128}
        className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105"
        fallbackText="Image non disponible"
      />
    </div>
  );
};
