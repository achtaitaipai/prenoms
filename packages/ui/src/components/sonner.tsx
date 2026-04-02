"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon style={{ width: 16, height: 16 }} />,
        info: <InfoIcon style={{ width: 16, height: 16 }} />,
        warning: <TriangleAlertIcon style={{ width: 16, height: 16 }} />,
        error: <OctagonXIcon style={{ width: 16, height: 16 }} />,
        loading: (
          <Loader2Icon style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--colors-popover)",
          "--normal-text": "var(--colors-popover\\.foreground)",
          "--normal-border": "var(--colors-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
