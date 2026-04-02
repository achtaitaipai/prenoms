import { css } from "styled-system/css";
import type { ComponentProps } from "react";

function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div
      data-slot="table-wrapper"
      className={css({ position: "relative", width: "full", overflowX: "auto" })}
    >
      <table
        data-slot="table"
        className={`${css({ width: "full", captionSide: "bottom", fontSize: "sm" })} ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={`${css({ "& tr": { borderBottomWidth: "1px" } })} ${className ?? ""}`}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={`${css({ "& tr:last-child": { borderBottomWidth: "0" } })} ${className ?? ""}`}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={`${css({ borderBottomWidth: "1px", transition: "colors", _hover: { bg: "muted/50" } })} ${className ?? ""}`}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={`${css({
        height: "10",
        px: "3",
        textAlign: "left",
        verticalAlign: "middle",
        fontWeight: "medium",
        color: "muted.foreground",
      })} ${className ?? ""}`}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={`${css({ px: "3", py: "2", verticalAlign: "middle" })} ${className ?? ""}`}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
