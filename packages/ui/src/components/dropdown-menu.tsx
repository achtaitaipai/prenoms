import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";
import { css } from "styled-system/css";
import { CheckIcon } from "lucide-react";
import * as React from "react";

function DropdownMenu({ ...props }: React.ComponentProps<typeof Menu.Root>) {
  return <Menu.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof Menu.Trigger>) {
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

const contentStyles = css({
  zIndex: 50,
  minWidth: "8rem",
  overflow: "hidden",
  bg: "popover",
  color: "popover.foreground",
  shadow: "md",
  ringWidth: "1px",
  ringColor: "foreground/10",
  py: "1",
});

function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof Menu.Content>) {
  return (
    <Portal>
      <Menu.Positioner>
        <Menu.Content
          data-slot="dropdown-menu-content"
          className={`${contentStyles} ${className ?? ""}`}
          {...props}
        />
      </Menu.Positioner>
    </Portal>
  );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof Menu.ItemGroup>) {
  return <Menu.ItemGroup data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.ItemGroupLabel>) {
  return (
    <Menu.ItemGroupLabel
      data-slot="dropdown-menu-label"
      className={`${css({ px: "2", py: "2", fontSize: "xs", color: "muted.foreground" })} ${className ?? ""}`}
      {...props}
    />
  );
}

const itemStyles = css({
  position: "relative",
  display: "flex",
  cursor: "default",
  alignItems: "center",
  gap: "2",
  px: "2",
  py: "2",
  fontSize: "xs",
  outline: "none",
  userSelect: "none",
  _highlighted: {
    bg: "accent",
    color: "accent.foreground",
  },
  _disabled: {
    pointerEvents: "none",
    opacity: 0.5,
  },
  "& svg": {
    pointerEvents: "none",
    flexShrink: 0,
    width: "4",
    height: "4",
  },
});

function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof Menu.Item>) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={`${itemStyles} ${className ?? ""}`}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.CheckboxItem>) {
  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={`${itemStyles} ${css({ pr: "8", pl: "2" })} ${className ?? ""}`}
      {...props}
    >
      <span
        className={css({
          pointerEvents: "none",
          position: "absolute",
          right: "2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Menu.ItemIndicator>
          <CheckIcon />
        </Menu.ItemIndicator>
      </span>
      {children}
    </Menu.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof Menu.RadioItemGroup>) {
  return <Menu.RadioItemGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Menu.RadioItem>) {
  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={`${itemStyles} ${css({ pr: "8", pl: "2" })} ${className ?? ""}`}
      {...props}
    >
      <span
        className={css({
          pointerEvents: "none",
          position: "absolute",
          right: "2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <Menu.ItemIndicator>
          <CheckIcon />
        </Menu.ItemIndicator>
      </span>
      {children}
    </Menu.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={`${css({ mx: "-1", height: "1px", bg: "border" })} ${className ?? ""}`}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={`${css({ ml: "auto", fontSize: "xs", letterSpacing: "widest", color: "muted.foreground" })} ${className ?? ""}`}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
