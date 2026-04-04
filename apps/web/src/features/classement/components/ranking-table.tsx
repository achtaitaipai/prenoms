import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@prenoms/ui/components/table";
import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { css } from "styled-system/css";

type RankingTableProps = {
  data: { firstname: string; total: number }[];
  page: number;
  pageSize: number;
  sex?: 1 | 2;
  highlightedFirstname?: string;
};

const iconLink = css({
  color: "muted.foreground",
  _hover: { color: "foreground" },
  transition: "color token(durations.fast)",
});

export function RankingTable({
  data,
  page,
  pageSize,
  sex,
  highlightedFirstname,
}: RankingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={css({ width: "4rem" })}>#</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead className={css({ textAlign: "right" })}>Total</TableHead>
          <TableHead className={css({ width: "5rem" })} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={row.firstname}
            className={
              highlightedFirstname === row.firstname
                ? css({ bg: "primary/10", fontWeight: "medium" })
                : undefined
            }
          >
            <TableCell className={css({ color: "muted.foreground" })}>
              {(page - 1) * pageSize + i + 1}
            </TableCell>
            <TableCell>{row.firstname}</TableCell>
            <TableCell className={css({ textAlign: "right" })}>
              {row.total.toLocaleString("fr-FR")}
            </TableCell>
            <TableCell>
              <div className={css({ display: "flex", gap: "2", justifyContent: "flex-end" })}>
                <Link
                  to="/$firstname"
                  params={{ firstname: row.firstname }}
                  search={(prev) => ({ ...prev, sex })}
                  className={iconLink}
                  title="Dashboard"
                >
                  <TrendingUp size={16} />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
