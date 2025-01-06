import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import type { Article } from "./types";
import { ArticleCard } from "./ArticleCard";

interface VirtualizedArticleListProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const VirtualizedArticleList = ({
  articles,
  onTagClick,
  selectedTags,
}: VirtualizedArticleListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: articles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height of each article card
    overscan: 5, // Number of items to render outside of the visible area
  });

  return (
    <div
      ref={parentRef}
      className="h-[800px] overflow-auto"
      style={{
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="p-2">
              <ArticleCard
                article={articles[virtualItem.index]}
                onTagClick={onTagClick}
                selectedTags={selectedTags}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};