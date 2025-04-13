
import React from 'react';
import { AtlasChapter } from './types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, BookOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AtlasCardProps {
  chapter: AtlasChapter;
  className?: string;
  onClick?: () => void;
}

export const AtlasCard: React.FC<AtlasCardProps> = ({ 
  chapter, 
  className,
  onClick 
}) => {
  // Determine if the chapter is new or updated
  const isNew = chapter.isNew;
  const isUpdated = chapter.isUpdated;
  
  // Format the update date if available
  const formattedDate = chapter.lastUpdated 
    ? new Date(chapter.lastUpdated).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) 
    : null;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md overflow-hidden group", 
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center text-xl text-primary">
            {chapter.id && <span className="text-base mr-2">{chapter.id}.</span>}
            {chapter.title}
          </CardTitle>
          <div className="flex gap-1 mt-1">
            {isNew && (
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                Nouveau
              </Badge>
            )}
            {isUpdated && (
              <Badge variant="outline" className="border-amber-500 text-amber-700">
                Mise à jour
              </Badge>
            )}
          </div>
        </div>
        {chapter.subtitle && (
          <CardDescription className="text-sm">{chapter.subtitle}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm line-clamp-3">{chapter.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-gray-500 flex items-center">
          {chapter.articleCount ? (
            <span className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              {chapter.articleCount} article{chapter.articleCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="flex items-center">
              <InfoIcon className="w-3 h-3 mr-1" />
              Détails
            </span>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary hover:text-primary-dark hover:bg-primary-50 p-0 h-auto"
        >
          <span className="flex items-center">
            Lire <BookOpen className="w-3 h-3 ml-1" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
