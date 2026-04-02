import { defineConfig } from "@pandacss/dev";
import uiPreset from "../../packages/ui/panda.config";

export default defineConfig({
  ...uiPreset,
  include: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  outdir: "../../packages/ui/styled-system",
});
