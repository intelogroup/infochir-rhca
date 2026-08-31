
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type SourceFilterType = 'all' | 'ADC' | 'IGM' | 'RHCA' | 'INDEX_ARTICLES';

interface SourceFilterProps {
  selectedSource: SourceFilterType;
  onSourceChange: (source: SourceFilterType) => void;
  articleCounts?: {
    total: number;
    ADC: number;
    IGM: number;
    RHCA: number;
    INDEX_ARTICLES: number;
  };
}

export const SourceFilter: React.FC<SourceFilterProps> = ({
  selectedSource,
  onSourceChange,
  articleCounts
}) => {
  const sources = [
    { key: 'ADC' as const, label: 'Atlas', count: articleCounts?.ADC },
    { key: 'IGM' as const, label: 'IGM', count: articleCounts?.IGM },
    { key: 'RHCA' as const, label: 'RHCA', count: articleCounts?.RHCA },
    { key: 'INDEX_ARTICLES' as const, label: 'Articles', count: articleCounts?.INDEX_ARTICLES }
  ];

  return (
    <div className="bg-card rounded-lg p-3 sm:p-4 border border-border shadow-sm mb-4">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {sources.map((source) => (
          <Button
            key={source.key}
            variant={selectedSource === source.key ? "default" : "outline"}
            size="sm"
            onClick={() => onSourceChange(source.key)}
            className={`
              flex items-center gap-2 transition-all duration-200
              ${selectedSource === source.key 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'hover:bg-muted border-border'
              }
            `}
          >
            <span className="font-medium">{source.label}</span>
            {source.count !== undefined && source.count > 0 && (
              <Badge 
                variant={selectedSource === source.key ? "secondary" : "outline"}
                className={`
                  text-xs px-1.5 py-0.5 min-w-[20px] h-5
                  ${selectedSource === source.key 
                    ? 'bg-card/20 text-primary-foreground border-white/30' 
                    : 'bg-muted text-muted-foreground border-border'
                  }
                `}
              >
                {source.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
