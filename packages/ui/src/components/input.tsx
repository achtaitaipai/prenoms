import { css } from "styled-system/css";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`${css({
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
      })} ${className ?? ""}`}
      {...props}
    />
  );
}

export { Input };
