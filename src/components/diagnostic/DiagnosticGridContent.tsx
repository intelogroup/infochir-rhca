import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useEffect } from "react";
import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticTable } from "./DiagnosticTable";
import { DiagnosticCase } from "./types";
import { DiagnosticSkeleton } from "./DiagnosticSkeleton";

interface DiagnosticGridContentProps {
  view: "grid" | "table";
  filteredCases: DiagnosticCase[];
}

export const DiagnosticGridContent = ({ view, filteredCases }: DiagnosticGridContentProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredCases.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimated height of each row
    overscan: 5, // Number of items to render outside the viewport
  });

  if (view === "grid") {
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
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <DiagnosticCard
                key={filteredCases[virtualRow.index].id}
                diagnosticCase={filteredCases[virtualRow.index]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <DiagnosticTable cases={filteredCases} />;
};