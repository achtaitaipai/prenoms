export type StatsResponse = {
  firstname: string;
  totalCount: number;
  byYear: { year: number; count: number }[];
};

export type Entry = {
  id: string;
  firstname: string;
  sex?: 1 | 2;
};

export const SEX_LABELS: Record<number, string> = { 1: "M", 2: "F" };

export function entryLabel(entry: Entry) {
  return entry.sex ? `${entry.firstname} (${SEX_LABELS[entry.sex]})` : entry.firstname;
}
