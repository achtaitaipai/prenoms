import { Button } from "@prenoms/ui/components/button";

type RankingPaginationProps = {
  page: number;
  pageSize: number;
  dataLength: number;
  onPageChange: (page: number) => void;
};

export function RankingPagination({ page, pageSize, dataLength, onPageChange }: RankingPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Précédent
      </Button>
      <span className="text-sm text-muted-foreground">Page {page}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={dataLength < pageSize}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </Button>
    </div>
  );
}
