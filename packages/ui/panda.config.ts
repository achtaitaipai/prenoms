import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./src/**/*.tsx", "../../apps/web/src/**/*.tsx"],
  outdir: "styled-system",
  conditions: {
    dark: ".dark &",
  },
  globalCss: {
    "*": {
      borderColor: "border",
      outlineColor: "ring/50",
    },
    html: {
      fontFamily: '"Inter Variable", sans-serif',
    },
    body: {
      fontFamily: '"Inter Variable", sans-serif',
      bg: "background",
      color: "foreground",
    },
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: { value: '"Inter Variable", sans-serif' },
        },
      },
      semanticTokens: {
        colors: {
          background: {
            value: { base: "oklch(1 0 0)", _dark: "oklch(0.145 0 0)" },
          },
          foreground: {
            value: { base: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          card: {
            value: { base: "oklch(1 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          "card.foreground": {
            value: { base: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          popover: {
            value: { base: "oklch(1 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          "popover.foreground": {
            value: { base: "oklch(0.145 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          primary: {
            value: { base: "oklch(0.205 0 0)", _dark: "oklch(0.87 0 0)" },
          },
          "primary.foreground": {
            value: { base: "oklch(0.985 0 0)", _dark: "oklch(0.205 0 0)" },
          },
          secondary: {
            value: { base: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          "secondary.foreground": {
            value: { base: "oklch(0.205 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          muted: {
            value: { base: "oklch(0.97 0 0)", _dark: "oklch(0.269 0 0)" },
          },
          "muted.foreground": {
            value: { base: "oklch(0.556 0 0)", _dark: "oklch(0.708 0 0)" },
          },
          accent: {
            value: { base: "oklch(0.97 0 0)", _dark: "oklch(0.371 0 0)" },
          },
          "accent.foreground": {
            value: { base: "oklch(0.205 0 0)", _dark: "oklch(0.985 0 0)" },
          },
          destructive: {
            value: {
              base: "oklch(0.58 0.22 27)",
              _dark: "oklch(0.704 0.191 22.216)",
            },
          },
          border: {
            value: {
              base: "oklch(0.922 0 0)",
              _dark: "oklch(1 0 0 / 10%)",
            },
          },
          input: {
            value: {
              base: "oklch(0.922 0 0)",
              _dark: "oklch(1 0 0 / 15%)",
            },
          },
          ring: {
            value: { base: "oklch(0.708 0 0)", _dark: "oklch(0.556 0 0)" },
          },
          "chart.1": {
            value: "oklch(0.809 0.105 251.813)",
          },
          "chart.2": {
            value: "oklch(0.623 0.214 259.815)",
          },
          "chart.3": {
            value: "oklch(0.546 0.245 262.881)",
          },
          "chart.4": {
            value: "oklch(0.488 0.243 264.376)",
          },
          "chart.5": {
            value: "oklch(0.424 0.199 265.638)",
          },
        },
        radii: {
          sm: { value: "calc(0.625rem - 4px)" },
          md: { value: "calc(0.625rem - 2px)" },
          lg: { value: "0.625rem" },
          xl: { value: "calc(0.625rem + 4px)" },
          "2xl": { value: "calc(0.625rem + 8px)" },
        },
      },
      keyframes: {
        pulse: {
          "50%": { opacity: "0.5" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
});
