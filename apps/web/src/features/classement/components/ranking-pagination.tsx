import { Pagination } from "@prenoms/ui/components/pagination";

type RankingPaginationProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function RankingPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
}: RankingPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination
      count={totalPages * pageSize}
      pageSize={pageSize}
      siblingCount={1}
      page={page}
      onPageChange={(details) => onPageChange(details.page)}
    />
  );
}
