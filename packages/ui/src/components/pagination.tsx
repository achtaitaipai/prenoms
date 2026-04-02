import { Pagination as ArkPagination } from "@ark-ui/react/pagination";
import { css, cx } from "styled-system/css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";

const triggerStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  height: "8",
  minWidth: "8",
  px: "2",
  fontSize: "xs",
  fontWeight: "medium",
  transition: "colors",
  _hover: { bg: "muted", color: "foreground" },
  _disabled: { pointerEvents: "none", opacity: 0.5 },
  "& svg": { width: "4", height: "4" },
});

const itemStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  height: "8",
  minWidth: "8",
  px: "2",
  fontSize: "xs",
  fontWeight: "medium",
  transition: "colors",
  _hover: { bg: "muted", color: "foreground" },
  _selected: { borderWidth: "1px", borderColor: "border", bg: "background" },
});

const ellipsisStyles = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "8",
  minWidth: "8",
  fontSize: "xs",
});

function Pagination({ className, ...props }: ComponentProps<typeof ArkPagination.Root>) {
  return (
    <ArkPagination.Root className={cx(css({ mx: "auto" }), className)} {...props}>
      <ArkPagination.Context>
        {(pagination) => (
          <div className={css({ display: "flex", alignItems: "center", gap: "0.5" })}>
            <ArkPagination.PrevTrigger className={triggerStyles}>
              <ChevronLeftIcon />
            </ArkPagination.PrevTrigger>
            {pagination.pages.map((page, index) =>
              page.type === "page" ? (
                <ArkPagination.Item key={index} {...page} className={itemStyles}>
                  {page.value}
                </ArkPagination.Item>
              ) : (
                <ArkPagination.Ellipsis key={index} index={index} className={ellipsisStyles}>
                  &hellip;
                </ArkPagination.Ellipsis>
              ),
            )}
            <ArkPagination.NextTrigger className={triggerStyles}>
              <ChevronRightIcon />
            </ArkPagination.NextTrigger>
          </div>
        )}
      </ArkPagination.Context>
    </ArkPagination.Root>
  );
}

export { Pagination };
