import { cva, type RecipeVariantProps } from "styled-system/css";

const buttonStyles = cva({
  base: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: "1px",
    borderColor: "transparent",
    fontSize: "xs",
    fontWeight: "medium",
    whiteSpace: "nowrap",
    transition: "all",
    outline: "none",
    userSelect: "none",
    cursor: "pointer",
    _focusVisible: {
      borderColor: "ring",
      ringWidth: "1px",
      ringColor: "ring/50",
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
  },
  variants: {
    variant: {
      default: {
        bg: "primary",
        color: "primary.foreground",
        _hover: { opacity: 0.8 },
      },
      outline: {
        borderColor: "border",
        bg: "background",
        _hover: { bg: "muted", color: "foreground" },
        _dark: { borderColor: "input", bg: "input/30" },
      },
      secondary: {
        bg: "secondary",
        color: "secondary.foreground",
        _hover: { opacity: 0.8 },
      },
      ghost: {
        _hover: { bg: "muted", color: "foreground" },
      },
      destructive: {
        bg: "destructive/10",
        color: "destructive",
        _hover: { bg: "destructive/20" },
      },
      link: {
        color: "primary",
        textUnderlineOffset: "4px",
        _hover: { textDecoration: "underline" },
      },
    },
    size: {
      default: { height: "8", gap: "1.5", px: "2.5" },
      xs: { height: "6", gap: "1", px: "2", fontSize: "xs" },
      sm: { height: "7", gap: "1", px: "2.5" },
      lg: { height: "9", gap: "1.5", px: "2.5" },
      icon: { width: "8", height: "8" },
      "icon-xs": { width: "6", height: "6" },
      "icon-sm": { width: "7", height: "7" },
      "icon-lg": { width: "9", height: "9" },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonVariants = RecipeVariantProps<typeof buttonStyles>;

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & ButtonVariants) {
  return (
    <button
      data-slot="button"
      className={`${buttonStyles({ variant, size })} ${className ?? ""}`}
      {...props}
    />
  );
}

export { Button, buttonStyles };
export type { ButtonVariants };
