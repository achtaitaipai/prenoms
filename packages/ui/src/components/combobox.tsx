import {
  Combobox as ArkCombobox,
  type ComboboxRootProps,
  type CollectionItem,
} from "@ark-ui/react/combobox";
import { Portal } from "@ark-ui/react/portal";
import { css, cx } from "styled-system/css";

function Root<T extends CollectionItem>({ className, ...props }: ComboboxRootProps<T>) {
  return (
    <ArkCombobox.Root
      data-slot="combobox"
      className={cx(css({ display: "flex", flexDirection: "column", gap: "1.5" }), className)}
      {...(props as ComboboxRootProps<CollectionItem>)}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<typeof ArkCombobox.Label>) {
  return (
    <ArkCombobox.Label
      data-slot="combobox-label"
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          gap: "2",
          fontSize: "xs",
          lineHeight: "1",
          userSelect: "none",
        }),
        className,
      )}
      {...props}
    />
  );
}

function Control({ className, ...props }: React.ComponentProps<typeof ArkCombobox.Control>) {
  return (
    <ArkCombobox.Control
      data-slot="combobox-control"
      className={cx(css({ position: "relative" }), className)}
      {...props}
    />
  );
}

function Input({ className, ...props }: React.ComponentProps<typeof ArkCombobox.Input>) {
  return (
    <ArkCombobox.Input
      data-slot="combobox-input"
      className={cx(
        css({
          height: "8",
          width: "full",
          minWidth: "0",
          borderWidth: "1px",
          borderColor: "input",
          bg: "transparent",
          px: "2.5",
          py: "1",
          fontSize: "xs",
          transition: "colors",
          outline: "none",
          _placeholder: { color: "muted.foreground" },
          _focusVisible: {
            borderColor: "ring",
            ringWidth: "1px",
            ringColor: "ring/50",
          },
          _disabled: {
            pointerEvents: "none",
            cursor: "not-allowed",
            opacity: 0.5,
          },
          _dark: {
            bg: "input/30",
          },
        }),
        className,
      )}
      {...props}
    />
  );
}

function Content({ className, ...props }: React.ComponentProps<typeof ArkCombobox.Content>) {
  return (
    <Portal>
      <ArkCombobox.Positioner>
        <ArkCombobox.Content
          data-slot="combobox-content"
          className={cx(
            css({
              zIndex: 50,
              minWidth: "8rem",
              overflow: "hidden",
              overflowY: "auto",
              maxHeight: "15rem",
              bg: "popover",
              color: "popover.foreground",
              shadow: "md",
              ringWidth: "1px",
              ringColor: "foreground/10",
              py: "1",
            }),
            className,
          )}
          {...props}
        />
      </ArkCombobox.Positioner>
    </Portal>
  );
}

function Item({ className, ...props }: React.ComponentProps<typeof ArkCombobox.Item>) {
  return (
    <ArkCombobox.Item
      data-slot="combobox-item"
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          gap: "2",
          px: "2",
          py: "2",
          fontSize: "xs",
          cursor: "pointer",
          outline: "none",
          userSelect: "none",
          _highlighted: {
            bg: "accent",
            color: "accent.foreground",
          },
        }),
        className,
      )}
      {...props}
    />
  );
}

function ItemText(props: React.ComponentProps<typeof ArkCombobox.ItemText>) {
  return <ArkCombobox.ItemText {...props} />;
}

function ItemIndicator(props: React.ComponentProps<typeof ArkCombobox.ItemIndicator>) {
  return <ArkCombobox.ItemIndicator {...props} />;
}

export { useListCollection } from "@ark-ui/react/combobox";
export const Combobox = { Root, Label, Control, Input, Content, Item, ItemText, ItemIndicator };
