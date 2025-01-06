import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AtlasModalHeaderProps {
  title: string;
  coverImage?: string;
}

const defaultCoverImage = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&fit=crop";

export const AtlasModalHeader = ({ title, coverImage }: AtlasModalHeaderProps) => {
  return (
    <div className="relative h-[200px] w-full">
      <img
        src={coverImage || defaultCoverImage}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
      <DialogHeader className="absolute bottom-4 left-6 right-6">
        <DialogTitle className="text-3xl font-bold text-white">
          {title}
        </DialogTitle>
      </DialogHeader>
    </div>
  );
};