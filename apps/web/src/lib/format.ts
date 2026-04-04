export function toTitleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function formatSimilarity(r: number) {
  return Math.round(((r + 1) / 2) * 100);
}

export const SEX_LABELS: Record<number, string> = { 1: "M", 2: "F" };
