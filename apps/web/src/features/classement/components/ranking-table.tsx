import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@prenoms/ui/components/table";

type RankingTableProps = {
  data: { firstname: string; total: number }[];
  page: number;
  pageSize: number;
};

export function RankingTable({ data, page, pageSize }: RankingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">#</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={row.firstname}>
            <TableCell className="text-muted-foreground">{(page - 1) * pageSize + i + 1}</TableCell>
            <TableCell>{row.firstname}</TableCell>
            <TableCell className="text-right">{row.total.toLocaleString("fr-FR")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
