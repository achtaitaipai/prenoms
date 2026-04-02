import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@prenoms/ui/components/pagination";
import { css } from "styled-system/css";

type RankingPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(page: number, totalPages: number) {
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (page > 3) pages.push("ellipsis");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (page < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

export function RankingPagination({ page, totalPages, onPageChange }: RankingPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text="Précédent"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className={css({ cursor: page <= 1 ? "default" : "pointer" })}
          />
        </PaginationItem>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => onPageChange(p)}
                className={css({ cursor: "pointer" })}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            text="Suivant"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={css({ cursor: page >= totalPages ? "default" : "pointer" })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
