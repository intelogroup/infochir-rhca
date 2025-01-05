import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AtlasModalHeaderProps {
  title: string;
  coverImage?: string;
}

export const AtlasModalHeader = ({ title, coverImage }: AtlasModalHeaderProps) => {
  return (
    <div className="relative h-[200px] w-full">
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
      <DialogHeader className="absolute bottom-4 left-6 right-6">
        <DialogTitle className="text-3xl font-bold text-white">
          {title}
        </DialogTitle>
      </DialogHeader>
    </div>
  );
};