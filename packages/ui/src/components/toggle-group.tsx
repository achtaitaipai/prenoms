import { ToggleGroup as ArkToggleGroup } from "@ark-ui/react/toggle-group";
import { css, cx } from "styled-system/css";

function Root({ className, ...props }: React.ComponentProps<typeof ArkToggleGroup.Root>) {
  return (
    <ArkToggleGroup.Root
      data-slot="toggle-group"
      className={cx(css({ display: "flex", gap: "1" }), className)}
      {...props}
    />
  );
}

function Item({ className, ...props }: React.ComponentProps<typeof ArkToggleGroup.Item>) {
  return (
    <ArkToggleGroup.Item
      data-slot="toggle-group-item"
      className={cx(
        css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "xs",
          fontWeight: "medium",
          height: "7",
          px: "2.5",
          borderWidth: "1px",
          borderColor: "border",
          bg: "background",
          cursor: "pointer",
          transition: "all",
          outline: "none",
          userSelect: "none",
          _hover: { bg: "muted", color: "foreground" },
          _dark: { borderColor: "input", bg: "input/30" },
          _focusVisible: {
            borderColor: "ring",
            ringWidth: "1px",
            ringColor: "ring/50",
          },
          _disabled: {
            pointerEvents: "none",
            opacity: 0.5,
          },
          "&[data-state=on]": {
            bg: "primary",
            color: "primary.foreground",
            borderColor: "transparent",
          },
          "&[data-state=on]:hover": {
            bg: "primary/80",
            color: "primary.foreground",
          },
        }),
        className,
      )}
      {...props}
    />
  );
}

export const ToggleGroup = { Root, Item };
