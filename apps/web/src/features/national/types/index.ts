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

export function entryId(firstname: string, sex?: 1 | 2) {
  return `${firstname}-${sex ?? "all"}`;
}

export const SEX_LABELS: Record<number, string> = { 1: "M", 2: "F" };

export function entryLabel(entry: Entry) {
  return entry.sex ? `${entry.firstname} (${SEX_LABELS[entry.sex]})` : entry.firstname;
}

export function serializeEntries(entries: Entry[]): string {
  return entries.map((e) => (e.sex ? `${e.firstname}:${e.sex}` : e.firstname)).join(",");
}

export function parseEntries(str: string): Entry[] {
  if (!str) return [];
  return str.split(",").map((part) => {
    const [firstname, sexStr] = part.split(":");
    const sex = sexStr === "1" ? 1 : sexStr === "2" ? 2 : undefined;
    return { id: entryId(firstname, sex), firstname, sex } as Entry;
  });
}
