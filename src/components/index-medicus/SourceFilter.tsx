
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
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-sm mb-4">
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
                ? 'bg-primary text-white shadow-md' 
                : 'hover:bg-gray-50 border-gray-200'
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
                    ? 'bg-white/20 text-white border-white/30' 
                    : 'bg-gray-100 text-gray-600 border-gray-200'
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
