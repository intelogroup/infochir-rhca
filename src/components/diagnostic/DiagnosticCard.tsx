import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface DiagnosticCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  category: string;
  author: string;
}

export const DiagnosticCard = ({
  title,
  description,
  imageUrl,
  date,
  category,
  author,
}: DiagnosticCardProps) => {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
    console.log("Using fallback image for:", title);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgError ? "/placeholder.svg" : imageUrl}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <h3 className="font-semibold text-lg leading-tight mb-2">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Par {author}</p>
      </CardFooter>
    </Card>
  );
};