import { css, cx } from "styled-system/css";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cx(
        css({
          display: "flex",
          flexDirection: "column",
          gap: "4",
          overflow: "hidden",
          bg: "card",
          py: "4",
          fontSize: "xs",
          lineHeight: "relaxed",
          color: "card.foreground",
          borderWidth: "1px",
          borderColor: "border",
          rounded: "lg",
        }),
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cx(
        css({
          display: "grid",
          gridAutoRows: "min-content",
          alignItems: "start",
          gap: "1",
          px: "4",
        }),
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cx(css({ fontSize: "sm", fontWeight: "medium" }), className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cx(
        css({ fontSize: "xs", lineHeight: "relaxed", color: "muted.foreground" }),
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cx(
        css({
          gridColumnStart: 2,
          gridRowStart: 1,
          gridRow: "span 2",
          alignSelf: "start",
          justifySelf: "end",
        }),
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cx(css({ px: "4" }), className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cx(
        css({ display: "flex", alignItems: "center", borderTopWidth: "1px", p: "4" }),
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
