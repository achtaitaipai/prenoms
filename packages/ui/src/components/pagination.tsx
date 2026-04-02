import * as React from "react";
import { css, cx } from "styled-system/css";
import { Button } from "@prenoms/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cx(
        css({ mx: "auto", display: "flex", width: "full", justifyContent: "center" }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cx(css({ display: "flex", alignItems: "center", gap: "0.5" }), className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size="icon"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <Button
      aria-label="Go to previous page"
      variant="ghost"
      size="default"
      className={className}
      {...props}
    >
      <ChevronLeftIcon />
      <span className={css({ display: { base: "none", sm: "block" } })}>{text}</span>
    </Button>
  );
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <Button
      aria-label="Go to next page"
      variant="ghost"
      size="default"
      className={className}
      {...props}
    >
      <span className={css({ display: { base: "none", sm: "block" } })}>{text}</span>
      <ChevronRightIcon />
    </Button>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cx(
        css({
          display: "flex",
          width: "8",
          height: "8",
          alignItems: "center",
          justifyContent: "center",
        }),
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon style={{ width: 16, height: 16 }} />
      <span className={css({ srOnly: true })}>More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
