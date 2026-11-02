/**
 * Pagination over an already-filtered list. The page count always derives
 * from the filtered total, and a page index past the end (e.g. after a
 * filter shrinks the list) clamps to the last valid page instead of
 * rendering an empty slice next to a stale "Page X sur Y".
 */
export interface PaginationWindow {
  totalPages: number;
  safePage: number;
  start: number;
  end: number;
}

export const getPaginationWindow = (
  totalItems: number,
  currentPage: number,
  pageSize: number
): PaginationWindow => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const safePage = Math.min(Math.max(0, currentPage), Math.max(0, totalPages - 1));
  const start = safePage * pageSize;
  return { totalPages, safePage, start, end: start + pageSize };
};
