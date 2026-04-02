import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { css, cx } from "styled-system/css";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: React.ComponentProps<typeof ArkCheckbox.Root>) {
  return (
    <ArkCheckbox.Root data-slot="checkbox" {...props}>
      <ArkCheckbox.Control
        className={cx(
          css({
            display: "flex",
            width: "4",
            height: "4",
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: "1px",
            borderColor: "input",
            transition: "colors",
            cursor: "pointer",
            _checked: {
              borderColor: "primary",
              bg: "primary",
              color: "primary.foreground",
            },
            _disabled: {
              cursor: "not-allowed",
              opacity: 0.5,
            },
          }),
          className,
        )}
      >
        <ArkCheckbox.Indicator>
          <CheckIcon style={{ width: 14, height: 14 }} />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  );
}

export { Checkbox };
