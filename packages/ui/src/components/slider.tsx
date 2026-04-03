import { Slider as ArkSlider } from "@ark-ui/react/slider";
import { css, cx } from "styled-system/css";

function Root({ className, ...props }: React.ComponentProps<typeof ArkSlider.Root>) {
  return (
    <ArkSlider.Root
      data-slot="slider"
      className={cx(css({ display: "flex", flexDirection: "column", gap: "1.5" }), className)}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<typeof ArkSlider.Label>) {
  return (
    <ArkSlider.Label
      data-slot="slider-label"
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

function ValueText({ className, ...props }: React.ComponentProps<typeof ArkSlider.ValueText>) {
  return (
    <ArkSlider.ValueText
      data-slot="slider-value-text"
      className={cx(
        css({
          fontSize: "xs",
          color: "muted.foreground",
          userSelect: "none",
        }),
        className,
      )}
      {...props}
    />
  );
}

function Control({ className, ...props }: React.ComponentProps<typeof ArkSlider.Control>) {
  return (
    <ArkSlider.Control
      data-slot="slider-control"
      className={cx(
        css({
          position: "relative",
          display: "flex",
          alignItems: "center",
          height: "5",
          cursor: "pointer",
        }),
        className,
      )}
      {...props}
    />
  );
}

function Track({ className, ...props }: React.ComponentProps<typeof ArkSlider.Track>) {
  return (
    <ArkSlider.Track
      data-slot="slider-track"
      className={cx(
        css({
          position: "relative",
          width: "full",
          height: "1",
          rounded: "full",
          bg: "muted",
        }),
        className,
      )}
      {...props}
    />
  );
}

function Range({ className, ...props }: React.ComponentProps<typeof ArkSlider.Range>) {
  return (
    <ArkSlider.Range
      data-slot="slider-range"
      className={cx(
        css({
          position: "absolute",
          height: "full",
          rounded: "full",
          bg: "primary",
        }),
        className,
      )}
      {...props}
    />
  );
}

function Thumb({ className, ...props }: React.ComponentProps<typeof ArkSlider.Thumb>) {
  return (
    <ArkSlider.Thumb
      data-slot="slider-thumb"
      className={cx(
        css({
          width: "4",
          height: "4",
          rounded: "full",
          bg: "primary",
          borderWidth: "2px",
          borderColor: "background",
          outline: "none",
          cursor: "grab",
          _active: { cursor: "grabbing" },
          _focusVisible: {
            ringWidth: "2px",
            ringColor: "ring",
            ringOffset: "2px",
          },
        }),
        className,
      )}
      {...props}
    />
  );
}

function HiddenInput(props: React.ComponentProps<typeof ArkSlider.HiddenInput>) {
  return <ArkSlider.HiddenInput {...props} />;
}

export const Slider = { Root, Label, ValueText, Control, Track, Range, Thumb, HiddenInput };
