import { css } from "styled-system/css";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={`${css({
        display: "flex",
        alignItems: "center",
        gap: "2",
        fontSize: "xs",
        lineHeight: "1",
        userSelect: "none",
      })} ${className ?? ""}`}
      {...props}
    />
  );
}

export { Label };
