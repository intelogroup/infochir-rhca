
import React from "react";

interface CarouselPaginationProps {
  current: number;
  total: number;
}

export const CarouselPagination = ({ current, total }: CarouselPaginationProps) => {
  return (
    <div className="hidden md:flex items-center justify-center mt-4 text-sm text-gray-600">
      <span>{current + 1} of {total}</span>
    </div>
  );
};
