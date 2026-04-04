export const RANKING_PAGE_SIZE = 12;

export const DEFAULT_NAMES = [
  "Marie",
  "Pierre",
  "Louis",
  "Jeanne",
  "Paul",
  "Anne",
  "Michel",
  "Catherine",
  "Jacques",
  "Sophie",
  "Philippe",
  "Isabelle",
  "Nicolas",
  "Claire",
  "Thomas",
  "Julie",
  "Lucas",
  "Emma",
  "Hugo",
  "Léa",
];

export function pickDefault(exclude: string) {
  const candidates = DEFAULT_NAMES.filter((n) => n.toUpperCase() !== exclude.toUpperCase());
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}
