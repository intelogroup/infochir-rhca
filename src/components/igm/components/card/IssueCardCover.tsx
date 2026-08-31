import { ImageOptimizer } from "@/components/shared/ImageOptimizer";

interface IssueCardCoverProps {
  coverImage?: string;
  title: string;
}

export const IssueCardCover = ({ coverImage, title }: IssueCardCoverProps) => {
  return (
    <div className="w-full aspect-[3/4] overflow-hidden bg-muted border-b border-border">
      <ImageOptimizer
        src={coverImage}
        alt={`Couverture ${title}`}
        width={300}
        height={400}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        fallbackText="Couverture non disponible"
      />
    </div>
  );
};
