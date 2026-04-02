import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@prenoms/ui/components/table";
import { css } from "styled-system/css";

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
          <TableHead className={css({ width: "4rem" })}>#</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead className={css({ textAlign: "right" })}>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={row.firstname}>
            <TableCell className={css({ color: "muted.foreground" })}>
              {(page - 1) * pageSize + i + 1}
            </TableCell>
            <TableCell>{row.firstname}</TableCell>
            <TableCell className={css({ textAlign: "right" })}>
              {row.total.toLocaleString("fr-FR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
